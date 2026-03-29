package com.fisioterapia.controller;

import com.fisioterapia.model.AppUser;
import com.fisioterapia.repository.AppUserRepository;
import com.fisioterapia.security.JwtUtil;
import com.fisioterapia.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.security.Principal;
import java.util.Arrays;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AppUserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private AuthController authController;

    private final String email = "avatar.test@example.com";
    private AppUser storedUser;

    @BeforeEach
    void setUp() {
        storedUser = new AppUser();
        storedUser.setEmail(email);
        storedUser.setFullName("Avatar Tester");
        storedUser.setPhone("3001234567");
        storedUser.setRole("USER");
        lenient().when(userRepository.findByEmail(email)).thenReturn(Optional.of(storedUser));
        lenient().when(userRepository.save(any(AppUser.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void updateCurrentUser_persistsAvatarUrl() {
        AuthController.ProfileUpdateRequest request = new AuthController.ProfileUpdateRequest();
        MockMultipartFile avatarFile =
                new MockMultipartFile("avatarFile", "avatar.jpg", "image/jpeg", new byte[]{1, 2, 3});
        request.setAvatarFile(avatarFile);

        Principal principal = () -> email;

        Map<String, String> response = authController.updateCurrentUser(request, principal);

        String expectedDataUrl = "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(new byte[]{1, 2, 3});
        assertThat(response.get("avatarUrl")).isEqualTo(expectedDataUrl);
        assertThat(response.get("email")).isEqualTo(email);

        verify(userRepository, times(1)).save(argThat(user ->
                Arrays.equals(new byte[]{1, 2, 3}, user.getAvatarData()) &&
                        "image/jpeg".equals(user.getAvatarContentType())
        ));
    }

    @Test
    void resetPassword_updatesStoredPassword() {
        storedUser.setEnabled(true);
        storedUser.setPasswordResetVerified(true);
        storedUser.setPasswordResetCode("123456");
        storedUser.setPasswordResetCodeExpiry(java.time.LocalDateTime.now().plusMinutes(10));
        AuthController.ResetPasswordRequest request = new AuthController.ResetPasswordRequest();
        request.setEmail(email);
        request.setNewPassword("NuevaClave1!");

        when(passwordEncoder.encode("NuevaClave1!")).thenReturn("encoded-password");

        Map<String, String> response = authController.resetPassword(request);

        assertThat(response.get("message")).contains("Contrasena restablecida correctamente");
        verify(userRepository).save(argThat(user -> "encoded-password".equals(user.getPassword())));
    }

    @Test
    void resetPassword_rejectsDisabledUsers() {
        storedUser.setEnabled(false);
        AuthController.ResetPasswordRequest request = new AuthController.ResetPasswordRequest();
        request.setEmail(email);
        request.setNewPassword("NuevaClave1!");

        assertThatThrownBy(() -> authController.resetPassword(request))
                .hasMessageContaining("Debes activar tu cuenta antes de restablecer la contrasena.");
    }

    @Test
    void requestPasswordResetCode_generatesCodeAndSendsEmail() {
        storedUser.setEnabled(true);
        AuthController.PasswordResetCodeRequest request = new AuthController.PasswordResetCodeRequest();
        request.setEmail(email);

        Map<String, String> response = authController.requestPasswordResetCode(request);

        assertThat(response.get("message")).contains("codigo de 6 digitos");
        verify(userRepository).save(argThat(user ->
                user.getPasswordResetCode() != null &&
                        user.getPasswordResetCode().matches("\\d{6}") &&
                        user.getPasswordResetCodeExpiry() != null &&
                        !user.isPasswordResetVerified()
        ));
        verify(notificationService).sendPasswordResetCode(eq(email), eq("Avatar Tester"), org.mockito.ArgumentMatchers.matches("\\d{6}"));
    }

    @Test
    void verifyPasswordResetCode_marksUserAsVerified() {
        storedUser.setEnabled(true);
        storedUser.setPasswordResetCode("123456");
        storedUser.setPasswordResetCodeExpiry(java.time.LocalDateTime.now().plusMinutes(10));
        storedUser.setPasswordResetVerified(false);

        AuthController.VerifyPasswordResetCodeRequest request = new AuthController.VerifyPasswordResetCodeRequest();
        request.setEmail(email);
        request.setCode("123456");

        Map<String, String> response = authController.verifyPasswordResetCode(request);

        assertThat(response.get("message")).contains("Codigo validado correctamente");
        verify(userRepository).save(argThat(AppUser::isPasswordResetVerified));
    }

    @Test
    void register_sendsWelcomeEmail() {
        AppUser newUser = new AppUser();
        newUser.setEmail("  Nuevo.Usuario@Example.com ");
        newUser.setFullName("Nuevo Usuario");
        newUser.setPassword("ClaveSegura1!");

        when(userRepository.existsByEmail("nuevo.usuario@example.com")).thenReturn(false);
        when(userRepository.findAll()).thenReturn(java.util.List.of(adminUser()));
        when(passwordEncoder.encode("ClaveSegura1!")).thenReturn("encoded-password");

        Map<String, String> response = authController.register(newUser);

        assertThat(response.get("message")).isEqualTo("Cuenta creada correctamente.");
        verify(notificationService).sendWelcomeEmail(
                eq("nuevo.usuario@example.com"),
                eq("Nuevo Usuario")
        );
    }

    @Test
    void register_persistsUserEvenWhenWelcomeEmailIsNotConfigured() {
        AppUser newUser = new AppUser();
        newUser.setEmail("nuevo.usuario@example.com");
        newUser.setFullName("Nuevo Usuario");
        newUser.setPassword("ClaveSegura1!");

        when(userRepository.existsByEmail("nuevo.usuario@example.com")).thenReturn(false);
        when(userRepository.findAll()).thenReturn(java.util.List.of(adminUser()));
        when(passwordEncoder.encode("ClaveSegura1!")).thenReturn("encoded-password");
        doThrow(new IllegalStateException("spring.mail.password faltante"))
                .when(notificationService).sendWelcomeEmail(eq("nuevo.usuario@example.com"), eq("Nuevo Usuario"));

        Map<String, String> response = authController.register(newUser);

        assertThat(response.get("message")).isEqualTo("Cuenta creada correctamente.");
        verify(userRepository).save(any(AppUser.class));
        verify(notificationService).sendWelcomeEmail(eq("nuevo.usuario@example.com"), eq("Nuevo Usuario"));
    }

    @Test
    void register_persistsUserWhenWelcomeEmailFails() {
        AppUser newUser = new AppUser();
        newUser.setEmail("nuevo.usuario@example.com");
        newUser.setFullName("Nuevo Usuario");
        newUser.setPassword("ClaveSegura1!");

        when(userRepository.existsByEmail("nuevo.usuario@example.com")).thenReturn(false);
        when(userRepository.findAll()).thenReturn(java.util.List.of(adminUser()));
        when(passwordEncoder.encode("ClaveSegura1!")).thenReturn("encoded-password");
        doThrow(new RuntimeException("smtp down"))
                .when(notificationService)
                .sendWelcomeEmail(eq("nuevo.usuario@example.com"), eq("Nuevo Usuario"));

        Map<String, String> response = authController.register(newUser);

        assertThat(response.get("message")).isEqualTo("Cuenta creada correctamente.");
        verify(userRepository).save(any(AppUser.class));
        verify(userRepository, never()).delete(any(AppUser.class));
    }

    private AppUser adminUser() {
        AppUser admin = new AppUser();
        admin.setEmail("admin@fisioterapia.com");
        admin.setRole("ADMIN");
        admin.setEnabled(true);
        return admin;
    }
}
