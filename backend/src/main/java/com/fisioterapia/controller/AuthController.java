package com.fisioterapia.controller;

import com.fisioterapia.model.AppUser;
import com.fisioterapia.repository.AppUserRepository;
import com.fisioterapia.security.JwtUtil;
import com.fisioterapia.service.NotificationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import org.springframework.beans.factory.annotation.Autowired;    
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
import java.util.UUID;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final String ADMIN_EMAIL = "admin@fisioterapia.com";

    @Autowired
    private AppUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private NotificationService notificationService;

    @Value("${app.frontend.url:http://localhost:8080}")
    private String frontendUrl;

    @GetMapping("/admin")
    public Map<String, String> getAdmin() {
        AppUser user = userRepository.findByEmail(ADMIN_EMAIL).orElse(null);
        if (user != null) {
            return Map.of("email", user.getEmail(), "role", user.getRole());
        } else {
            return Map.of("error", "Admin not found");
        }
    }

    @GetMapping("/me")
    public Map<String, String> getCurrentUser(Principal principal) {
        AppUser user = requireAuthenticatedUser(principal);
        return buildUserResponse(user);
    }

    @PutMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> updateCurrentUser(@Valid @ModelAttribute ProfileUpdateRequest request, Principal principal) {
        AppUser user = requireAuthenticatedUser(principal);

        if (request.getEmail() != null) {
            String normalizedEmail = request.getEmail().trim();
            if (normalizedEmail.isEmpty()) {
                throw new ResponseStatusException(BAD_REQUEST, "El correo no puede estar vacío");
            }
            if (!normalizedEmail.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmail(normalizedEmail)) {
                throw new ResponseStatusException(BAD_REQUEST, "Ya existe un usuario con ese correo.");
            }
            user.setEmail(normalizedEmail);
        }

        if (request.getFullName() != null) {
            String trimmedName = request.getFullName().trim();
            if (trimmedName.isEmpty()) {
                throw new ResponseStatusException(BAD_REQUEST, "El nombre no puede estar vacío");
            }
            user.setFullName(trimmedName);
        }

        if (request.getPhone() != null) {
            String trimmedPhone = request.getPhone().trim();
            if (trimmedPhone.isEmpty()) {
                throw new ResponseStatusException(BAD_REQUEST, "El teléfono no puede estar vacío");
            }
            user.setPhone(trimmedPhone);
        }

        MultipartFile avatarFile = request.getAvatarFile();
        if (avatarFile != null && !avatarFile.isEmpty()) {
            try {
                user.setAvatarData(avatarFile.getBytes());
                user.setAvatarContentType(avatarFile.getContentType());
            } catch (IOException e) {
                throw new ResponseStatusException(BAD_REQUEST, "No se pudo leer la imagen");
            }
        }

        AppUser updated = userRepository.save(user);
        return buildUserResponse(updated);
    }

    @GetMapping("/me/avatar")
    public ResponseEntity<byte[]> getCurrentUserAvatar(Principal principal) {
        AppUser user = requireAuthenticatedUser(principal);
        byte[] avatar = user.getAvatarData();
        if (avatar == null || avatar.length == 0) {
            return ResponseEntity.noContent().build();
        }

        MediaType contentType = MediaType.IMAGE_JPEG;
        try {
            if (user.getAvatarContentType() != null && !user.getAvatarContentType().isEmpty()) {
                contentType = MediaType.parseMediaType(user.getAvatarContentType());
            }
        } catch (Exception ignored) {
        }

        return ResponseEntity.ok().contentType(contentType).body(avatar);
    }

    private AppUser requireAuthenticatedUser(Principal principal) {
        if (principal == null) {
            throw new ResponseStatusException(UNAUTHORIZED, "No autenticado");
        }
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Usuario no encontrado"));
    }

    private AppUser requireEnabledUserByEmail(String email) {
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase();
        if (normalizedEmail.isEmpty()) {
            throw new ResponseStatusException(BAD_REQUEST, "El correo es obligatorio.");
        }

        AppUser user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "No existe una cuenta con ese correo."));

        if (!user.isEnabled()) {
            throw new ResponseStatusException(BAD_REQUEST, "Debes activar tu cuenta antes de restablecer la contrasena.");
        }

        return user;
    }

    private void clearPasswordResetState(AppUser user) {
        user.setPasswordResetCode(null);
        user.setPasswordResetCodeExpiry(null);
        user.setPasswordResetVerified(false);
    }

    private Map<String, String> buildUserResponse(AppUser user) {
        String fullName = user.getFullName() == null ? "" : user.getFullName();
        String phone = user.getPhone() == null ? "" : user.getPhone();
        String avatarUrl = buildAvatarUrl(user);
        return Map.of(
                "email", user.getEmail(),
                "role", user.getRole(),
                "fullName", fullName,
                "phone", phone,
                "avatarUrl", avatarUrl
        );
    }

    private String buildAvatarUrl(AppUser user) {
        byte[] avatar = user.getAvatarData();
        if (avatar == null || avatar.length == 0) {
            return "";
        }
        String contentType = user.getAvatarContentType();
        if (contentType == null || contentType.isBlank()) {
            contentType = MediaType.IMAGE_JPEG_VALUE;
        }
        String base64 = Base64.getEncoder().encodeToString(avatar);
        return "data:" + contentType + ";base64," + base64;
    }

    public static class ProfileUpdateRequest {
        @Email(message = "Correo inválido")
        private String email;

        @Pattern(regexp = "^[\\p{L} ]+$", message = "El nombre solo puede contener letras y espacios")
        private String fullName;

        @Pattern(regexp = "^[0-9]+$", message = "El celular debe contener solo números")
        private String phone;
        private MultipartFile avatarFile;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public MultipartFile getAvatarFile() {
            return avatarFile;
        }

        public void setAvatarFile(MultipartFile avatarFile) {
            this.avatarFile = avatarFile;
        }
    }

    @PostMapping("/register")
    public Map<String, String> register(@Valid @RequestBody AppUser user) {
        String normalizedEmail = user.getEmail() == null ? "" : user.getEmail().trim().toLowerCase();
        if (normalizedEmail.isEmpty()) {
            throw new ResponseStatusException(BAD_REQUEST, "El correo es obligatorio.");
        }
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(BAD_REQUEST, "Ya existe un usuario con ese correo.");
        }

        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (ADMIN_EMAIL.equals(user.getEmail())) {
            user.setRole("ADMIN");
            user.setEnabled(true);
            user.setVerificationToken(null);
            user.setVerificationTokenExpiry(null);
        } else {
            boolean hasAdmin = userRepository.findAll().stream().anyMatch(u -> "ADMIN".equals(u.getRole()));
            if (!hasAdmin) {
                user.setRole("ADMIN");
                user.setEnabled(true);
                user.setVerificationToken(null);
                user.setVerificationTokenExpiry(null);
            } else {
                user.setRole("USER");
                user.setEnabled(true);
                user.setVerificationToken(null);
                user.setVerificationTokenExpiry(null);
            }
        }
        AppUser savedUser = userRepository.save(user);

        try {
            notificationService.sendWelcomeEmail(
                    savedUser.getEmail(),
                    savedUser.getFullName()
            );
        } catch (RuntimeException ex) {
            System.out.println("[AuthController] No se pudo enviar el correo de bienvenida a " + savedUser.getEmail() + ". Causa: " + ex.getMessage());
        }

        return Map.of("message", "Cuenta creada correctamente.");
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email") == null ? "" : credentials.get("email").trim().toLowerCase();
        String password = credentials.get("password");

        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (passwordEncoder.matches(password, user.getPassword())) {
            String token = jwtUtil.generateToken(email);
            return Map.of("token", token);
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }

    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        AppUser user = requireEnabledUserByEmail(request.getEmail());
        String newPassword = request.getNewPassword() == null ? "" : request.getNewPassword().trim();
        if (newPassword.isEmpty()) {
            throw new ResponseStatusException(BAD_REQUEST, "La nueva contrasena es obligatoria.");
        }

        if (!user.isPasswordResetVerified()) {
            throw new ResponseStatusException(BAD_REQUEST, "Primero debes validar el codigo enviado a tu correo.");
        }

        if (user.getPasswordResetCodeExpiry() == null || user.getPasswordResetCodeExpiry().isBefore(LocalDateTime.now())) {
            clearPasswordResetState(user);
            userRepository.save(user);
            throw new ResponseStatusException(BAD_REQUEST, "El codigo ingresado esta vencido. Solicita uno nuevo.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        clearPasswordResetState(user);
        userRepository.save(user);

        return Map.of("message", "Contrasena restablecida correctamente. Ya puedes iniciar sesion.");
    }

    @PostMapping("/reset-password/request-code")
    public Map<String, String> requestPasswordResetCode(@Valid @RequestBody PasswordResetCodeRequest request) {
        AppUser user = requireEnabledUserByEmail(request.getEmail());
        String code = String.format("%06d", ThreadLocalRandom.current().nextInt(0, 1_000_000));

        user.setPasswordResetCode(code);
        user.setPasswordResetCodeExpiry(LocalDateTime.now().plusMinutes(5));
        user.setPasswordResetVerified(false);
        userRepository.save(user);

        notificationService.sendPasswordResetCode(user.getEmail(), user.getFullName(), code);

        return Map.of("message", "Te enviamos un codigo de 6 digitos a tu correo electronico.");
    }

    @PostMapping("/reset-password/verify-code")
    public Map<String, String> verifyPasswordResetCode(@Valid @RequestBody VerifyPasswordResetCodeRequest request) {
        AppUser user = requireEnabledUserByEmail(request.getEmail());
        String code = request.getCode() == null ? "" : request.getCode().trim();

        if (!code.matches("^\\d{6}$")) {
            throw new ResponseStatusException(BAD_REQUEST, "El codigo debe tener 6 digitos numericos.");
        }

        if (user.getPasswordResetCode() == null || user.getPasswordResetCodeExpiry() == null) {
            throw new ResponseStatusException(BAD_REQUEST, "El codigo ingresado ya fue usado o debes solicitar uno nuevo.");
        }

        if (user.getPasswordResetCodeExpiry().isBefore(LocalDateTime.now())) {
            clearPasswordResetState(user);
            userRepository.save(user);
            throw new ResponseStatusException(BAD_REQUEST, "El codigo ingresado esta vencido. Solicita uno nuevo.");
        }

        if (!code.equals(user.getPasswordResetCode())) {
            throw new ResponseStatusException(BAD_REQUEST, "El codigo ingresado es incorrecto.");
        }

        user.setPasswordResetVerified(true);
        userRepository.save(user);

        return Map.of("message", "Codigo validado correctamente.");
    }

    @GetMapping("/verify")
    public Map<String, String> verifyAccount(@RequestParam("token") String token) {
        AppUser user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "El enlace de activacion no es valido."));

        if (user.isEnabled()) {
            return Map.of("message", "La cuenta ya estaba activada.");
        }

        if (user.getVerificationTokenExpiry() == null || user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(BAD_REQUEST, "El enlace de activacion ya vencio. Registrate nuevamente o solicita uno nuevo.");
        }

        user.setEnabled(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        userRepository.save(user);

        return Map.of("message", "Cuenta activada correctamente. Ya puedes iniciar sesion.");
    }

    public static class ResetPasswordRequest {
        @Email(message = "Correo invalido")
        private String email;

        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()\\[\\]{}\\-_=+\\\\|;:'\\\",.<>/?]).{8,}$",
                message = "La contrasena debe tener mayuscula, minuscula, numero y simbolo especial"
        )
        private String newPassword;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }

    public static class PasswordResetCodeRequest {
        @Email(message = "Correo invalido")
        private String email;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

    public static class VerifyPasswordResetCodeRequest {
        @Email(message = "Correo invalido")
        private String email;

        @Pattern(regexp = "^\\d{6}$", message = "El codigo debe tener 6 digitos numericos")
        private String code;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }
    }
}
