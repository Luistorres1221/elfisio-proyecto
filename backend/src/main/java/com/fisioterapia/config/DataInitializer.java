package com.fisioterapia.config;

import com.fisioterapia.model.AppUser;
import com.fisioterapia.model.AppSettings;
import com.fisioterapia.model.RoleEntity;
import com.fisioterapia.repository.AppSettingsRepository;
import com.fisioterapia.repository.AppUserRepository;
import com.fisioterapia.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    private static final String ADMIN_EMAIL = "admin@fisioterapia.com";
    private static final String[] LEGACY_ADMIN_EMAILS = {
            "admin@elfisio.com",
            "admin@fisioterapia.local"
    };
    private static final String RECEPTIONIST_ROLE = "RECEPCIONISTA";
    private static final String LEGACY_RECEPTIONIST_ROLE = "RECEPTIONIST";

    @Autowired
    private AppUserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AppSettingsRepository settingsRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("DataInitializer running...");
        createRoleIfMissing("ADMIN", "Control total del panel administrativo.");
        createRoleIfMissing("THERAPIST", "Profesional encargado de atender pacientes.");
        createRoleIfMissing("PATIENT", "Acceso de paciente a sus datos.");
        createRoleIfMissing("USER", "Usuario general del sistema.");
        ensureReceptionistRole();
        createRoleIfMissing(RECEPTIONIST_ROLE, "Gestiona las citas y la atención inicial en recepción.");

        AppUser currentAdmin = userRepository.findByEmail(ADMIN_EMAIL).orElse(null);
        AppUser legacyAdmin = null;

        for (String legacyEmail : LEGACY_ADMIN_EMAILS) {
            legacyAdmin = userRepository.findByEmail(legacyEmail).orElse(null);
            if (legacyAdmin != null) {
                break;
            }
        }

        if (currentAdmin == null && legacyAdmin != null) {
            legacyAdmin.setEmail(ADMIN_EMAIL);
            legacyAdmin.setRole("ADMIN");
            legacyAdmin.setEnabled(true);
            legacyAdmin.setVerificationToken(null);
            legacyAdmin.setVerificationTokenExpiry(null);
            ensureUserInfo(legacyAdmin, "Administrador", "0000000000");
            userRepository.save(legacyAdmin);
            System.out.println("Usuario administrador migrado a: email=" + ADMIN_EMAIL);
        } else if (currentAdmin == null) {
            AppUser admin = new AppUser(ADMIN_EMAIL, passwordEncoder.encode("admin123"), "ADMIN");
            admin.setEnabled(true);
            ensureUserInfo(admin, "Administrador", "0000000000");
            userRepository.save(admin);
            System.out.println("Usuario administrador creado: email=" + ADMIN_EMAIL + ", password=admin123");
        } else {
            ensureUserInfo(currentAdmin, "Administrador", "0000000000");

            if (!currentAdmin.isEnabled()) {
                currentAdmin.setEnabled(true);
                currentAdmin.setVerificationToken(null);
                currentAdmin.setVerificationTokenExpiry(null);
                userRepository.save(currentAdmin);
            } else if (currentAdmin.getFullName() == null || currentAdmin.getFullName().isBlank()
                    || currentAdmin.getPhone() == null || currentAdmin.getPhone().isBlank()) {
                userRepository.save(currentAdmin);
            }
            System.out.println("Usuario administrador ya existe");
        }

        if (settingsRepository.findById(1L).isEmpty()) {
            AppSettings settings = new AppSettings();
            settings.setId(1L);
            settings.setSiteName("ELFISIO");
            settingsRepository.save(settings);
            System.out.println("Configuración inicial creada");
        }
    }

    private void createRoleIfMissing(String name, String description) {
        if (roleRepository.findByName(name).isEmpty()) {
            roleRepository.save(new RoleEntity(name, description, true));
        }
    }

    private void ensureReceptionistRole() {
        if (roleRepository.findByName(RECEPTIONIST_ROLE).isPresent()) {
            return;
        }

        roleRepository.findByName(LEGACY_RECEPTIONIST_ROLE).ifPresent(role -> {
            role.setName(RECEPTIONIST_ROLE);
            roleRepository.save(role);

            userRepository.findAll().stream()
                    .filter(user -> LEGACY_RECEPTIONIST_ROLE.equals(user.getRole()))
                    .forEach(user -> {
                        user.setRole(RECEPTIONIST_ROLE);
                        userRepository.save(user);
                    });
        });
    }

    private void ensureUserInfo(AppUser user, String defaultFullName, String defaultPhone) {
        if (user.getFullName() == null || user.getFullName().isBlank()) {
            user.setFullName(defaultFullName);
        }
        if (user.getPhone() == null || user.getPhone().isBlank()) {
            user.setPhone(defaultPhone);
        }
    }
}
