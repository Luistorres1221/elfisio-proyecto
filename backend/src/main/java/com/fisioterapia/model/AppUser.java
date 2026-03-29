package com.fisioterapia.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class AppUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Email
    @Column(unique = true)
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    @Pattern(regexp = "^[\\p{L} ]+$", message = "El nombre solo puede contener letras y espacios")
    @Column
    private String fullName;

    @NotBlank
    @Pattern(regexp = "^[0-9]+$", message = "El celular debe contener solo números")
    @Column
    private String phone;

    @Lob
    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;

    @Lob
    @Column(name = "avatar_data")
    private byte[] avatarData;

    @Column(name = "avatar_content_type")
    private String avatarContentType;

    @NotBlank
    @Column(nullable = false)
    private String role = "USER";

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean enabled = false;

    @Column(name = "verification_token", unique = true)
    private String verificationToken;

    @Column(name = "verification_token_expiry")
    private LocalDateTime verificationTokenExpiry;

    @Column(name = "password_reset_code")
    private String passwordResetCode;

    @Column(name = "password_reset_code_expiry")
    private LocalDateTime passwordResetCodeExpiry;

    @Column(name = "password_reset_verified", nullable = false, columnDefinition = "boolean default false")
    private boolean passwordResetVerified = false;

    public AppUser() {}

    public AppUser(String email, String password, String role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public byte[] getAvatarData() { return avatarData; }
    public void setAvatarData(byte[] avatarData) { this.avatarData = avatarData; }
    public String getAvatarContentType() { return avatarContentType; }
    public void setAvatarContentType(String avatarContentType) { this.avatarContentType = avatarContentType; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public String getVerificationToken() { return verificationToken; }
    public void setVerificationToken(String verificationToken) { this.verificationToken = verificationToken; }
    public LocalDateTime getVerificationTokenExpiry() { return verificationTokenExpiry; }
    public void setVerificationTokenExpiry(LocalDateTime verificationTokenExpiry) { this.verificationTokenExpiry = verificationTokenExpiry; }
    public String getPasswordResetCode() { return passwordResetCode; }
    public void setPasswordResetCode(String passwordResetCode) { this.passwordResetCode = passwordResetCode; }
    public LocalDateTime getPasswordResetCodeExpiry() { return passwordResetCodeExpiry; }
    public void setPasswordResetCodeExpiry(LocalDateTime passwordResetCodeExpiry) { this.passwordResetCodeExpiry = passwordResetCodeExpiry; }
    public boolean isPasswordResetVerified() { return passwordResetVerified; }
    public void setPasswordResetVerified(boolean passwordResetVerified) { this.passwordResetVerified = passwordResetVerified; }
}
