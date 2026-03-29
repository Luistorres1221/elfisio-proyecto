package com.fisioterapia.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class NotificationService {

    private static final String AUTH_IMAGE_CID = "authImage";
    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String senderEmail;

    @Value("${spring.mail.password:}")
    private String senderPassword;

    @PostConstruct
    void logMailConfigurationStatus() {
        if (!isMailConfigured()) {
            log.warn("Email saliente no configurado completamente. Define spring.mail.username y spring.mail.password para habilitar correos automáticos.");
        }
    }

    public void sendEmail(String to, String subject, String text) {
        if (!isMailConfigured()) {
            throw new IllegalStateException(buildMissingConfigurationMessage("correo"));
        }
        SimpleMailMessage message = new SimpleMailMessage();
        if (senderEmail != null && !senderEmail.isBlank()) {
            message.setFrom(senderEmail);
        }
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    public void sendAppointmentReminder(String email, String patientName, String dateTime) {
        String subject = "Recordatorio de Cita de Fisioterapia";
        String text = "Hola " + patientName + ",\n\nEste es un recordatorio de tu cita programada para " + dateTime + ".\n\nSaludos,\nEquipo de Fisioterapia";
        sendEmail(email, subject, text);
    }

    public void sendWelcomeVerificationEmail(String email, String fullName, String activationUrl) {
        String displayName = (fullName == null || fullName.isBlank()) ? "usuario" : fullName.trim();
        String subject = "Bienvenido/a a ELFISIO - Registro exitoso";
        String activationBlock = activationUrl == null || activationUrl.isBlank()
                ? "<p style=\"color:#ccc;font-size:15px;line-height:1.6;margin:0;\">Ya puedes ingresar y comenzar a utilizar nuestros servicios.</p>"
                : "<p style=\"color:#ccc;font-size:15px;line-height:1.6;margin:0 0 16px;\">Tu cuenta fue creada correctamente. Para poder iniciar sesion, primero debes activar tu cuenta.</p>"
                + "<p style=\"margin:0 0 20px;\"><a href=\"" + activationUrl + "\" style=\"display:inline-block;background:#00aaff;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:bold;\">Activar cuenta</a></p>"
                + "<p style=\"color:#ccc;font-size:13px;line-height:1.6;margin:0;\">Si el boton no funciona, copia y pega este enlace en tu navegador:<br>" + activationUrl + "</p>";

        String html = """
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <title>Bienvenido</title>
                </head>
                <body style="margin:0;font-family:Arial,sans-serif;background:#0a0a0a;color:#ffffff;">
                    <div style="display:flex;justify-content:center;align-items:center;padding:40px 16px;">
                        <div style="background:#111;padding:40px;border-radius:15px;box-shadow:0 0 20px rgba(0,140,255,0.4);max-width:400px;text-align:center;">
                            <img src="cid:%s" alt="Logo EL FISIO" style="width:140px;margin-bottom:20px;border-radius:50%%;object-fit:cover;">
                            <h1 style="color:#00aaff;margin:0 0 5px;">¡Bienvenido, %s!</h1>
                            <h2 style="color:#ffffff;margin:0 0 15px;">Registro exitoso</h2>
                            <p style="color:#ccc;font-size:15px;line-height:1.6;">
                                Tu cuenta ha sido creada correctamente en <strong>EL FISIO</strong>.
                            </p>
                            %s
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(AUTH_IMAGE_CID, escapeHtml(displayName), activationBlock);

        String text = "Hola " + displayName + ",\n\n"
                + "Tu cuenta ha sido creada correctamente en EL FISIO S.A.\n"
                + (activationUrl == null || activationUrl.isBlank()
                ? "Ya puedes ingresar y comenzar a utilizar nuestros servicios.\n\n"
                : "Para activar tu cuenta y poder iniciar sesiÓn, usa este enlace:\n" + activationUrl + "\n\n")
                + "Saludos,\nEquipo ELFISIO";

        sendHtmlEmail(email, subject, html, text);
    }

    public void sendWelcomeEmail(String email, String fullName) {
        String displayName = (fullName == null || fullName.isBlank()) ? "usuario" : fullName.trim();
        String subject = "Bienvenido/a a ELFISIO - Registro exitoso";

        String html = """
                <!DOCTYPE html>
                <html lang=\"es\">
                <head>
                    <meta charset=\"UTF-8\">
                    <title>Bienvenido</title>
                </head>
                <body style=\"margin:0;font-family:Arial,sans-serif;background:#0a0a0a;color:#ffffff;\">
                    <div style=\"display:flex;justify-content:center;align-items:center;padding:40px 16px;\">
                        <div style=\"background:#111;padding:40px;border-radius:15px;box-shadow:0 0 20px rgba(0,140,255,0.4);max-width:400px;text-align:center;\">
                            <img src=\"cid:%s\" alt=\"Logo EL FISIO\" style=\"width:140px;margin-bottom:20px;border-radius:50%%;object-fit:cover;\">
                            <h1 style=\"color:#00aaff;margin:0 0 5px;\">¡Bienvenido, %s!</h1>
                            <h2 style=\"color:#ffffff;margin:0 0 15px;\">Registro exitoso</h2>
                            <p style=\"color:#ccc;font-size:15px;line-height:1.6;\">
                                Tu cuenta ha sido creada correctamente en <strong>EL FISIO</strong>.
                            </p>
                            <p style=\"color:#ccc;font-size:15px;line-height:1.6;\">Gracias por registrarte. Ya puedes iniciar sesion y disfrutar de nuestros servicios.</p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(AUTH_IMAGE_CID, escapeHtml(displayName));

        String text = "Hola " + displayName + ",\n\n"
                + "Tu cuenta ha sido creada correctamente en ELFISIO S.A.\n"
                + "Ya puedes iniciar sesion y comenzar a utilizar nuestros servicios.\n\n"
                + "Saludos,\nEquipo ELFISIO";

        sendHtmlEmail(email, subject, html, text);
    }

    public void sendPasswordResetCode(String email, String fullName, String code) {
        String displayName = (fullName == null || fullName.isBlank()) ? "usuario" : fullName.trim();
        String subject = "ELFISIO S.A. - Codigo para restablecer tu contrasena";
        String text = "Hola " + displayName + ",\n\n"
                + "Recibimos una solicitud para restablecer tu contrasena.\n"
                + "Tu codigo de verificacion es: " + code + "\n\n"
                + "Este codigo vence en 5 minutos y solo puede usarse una vez.\n"
                + "Si no solicitaste este cambio, ignora este mensaje.\n\n"
                + "Saludos,\nEquipo ELFISIO";
        sendEmail(email, subject, text);
    }

    public void sendSMS(String phone, String message) {
        // Placeholder for SMS implementation
        log.info("Sending SMS to {}: {}", phone, message);
    }

    public void ensureEmailDeliveryConfigured(String emailType) {
        if (!isMailConfigured()) {
            throw new IllegalStateException(buildMissingConfigurationMessage(emailType));
        }
    }

    private void sendHtmlEmail(String to, String subject, String html, String fallbackText) {
        if (!isMailConfigured()) {
            throw new IllegalStateException(buildMissingConfigurationMessage("correo HTML"));
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            if (senderEmail != null && !senderEmail.isBlank()) {
                helper.setFrom(senderEmail);
            }
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);

            Path imagePath = resolveAuthImagePath();
            if (imagePath != null) {
                helper.addInline(AUTH_IMAGE_CID, new FileSystemResource(imagePath));
            }

            mailSender.send(message);
        } catch (MessagingException | MailException ex) {
            log.warn("Fallo el envio del correo HTML a {}. Se intentara texto plano. Causa: {}", to, ex.getMessage());
            sendEmail(to, subject, fallbackText);
        }
    }

    public boolean isMailConfigured() {
        return mailSender != null && senderEmail != null && !senderEmail.isBlank() && senderPassword != null && !senderPassword.isBlank();
    }

    private String buildMissingConfigurationMessage(String emailType) {
        return "No se pudo enviar el " + emailType + " porque el correo saliente no esta configurado. Define la variable spring.mail.password y reinicia el backend.";
    }

    private Path resolveAuthImagePath() {
        Path[] candidates = new Path[] {
                Paths.get("..", "frontend", "src", "assets", "autenticacion.png"),
                Paths.get("frontend", "src", "assets", "autenticacion.png"),
                Paths.get("src", "assets", "autenticacion.png")
        };

        for (Path candidate : candidates) {
            Path absolutePath = candidate.toAbsolutePath().normalize();
            if (Files.exists(absolutePath)) {
                return absolutePath;
            }
        }

        return null;
    }

    private String escapeHtml(String value) {
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
