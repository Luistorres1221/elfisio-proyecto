package com.fisioterapia.controller;

import com.fisioterapia.model.AppSettings;
import com.fisioterapia.repository.AppSettingsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/settings")
@PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
public class SettingsController {
    private static final Long SETTINGS_ID = 1L;
    private static final Logger log = LoggerFactory.getLogger(SettingsController.class);

    private final AppSettingsRepository repository;

    public SettingsController(AppSettingsRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public Map<String, Object> getSettings() {
        try {
            AppSettings settings = repository.findById(SETTINGS_ID).orElseGet(this::buildDefaults);
            return toResponse(settings);
        } catch (Exception ex) {
            log.error("No se pudieron cargar los ajustes administrativos. Se devolveran valores por defecto.", ex);
            return toResponse(buildDefaults());
        }
    }

    @PutMapping
    public Map<String, Object> updateSettings(@RequestBody AppSettings settings) {
        try {
            AppSettings current = repository.findById(SETTINGS_ID).orElseGet(this::buildDefaults);

            current.setId(SETTINGS_ID);
            current.setSiteName(isBlank(settings.getSiteName()) ? "FisioVida" : settings.getSiteName().trim());
            current.setLogoUrl(blankToNull(settings.getLogoUrl()));
            current.setCompanyName(blankToNull(settings.getCompanyName()));
            current.setCompanyEmail(blankToNull(settings.getCompanyEmail()));
            current.setCompanyPhone(blankToNull(settings.getCompanyPhone()));
            current.setAddress(blankToNull(settings.getAddress()));

            AppSettings saved = repository.save(current);
            return toResponse(saved);
        } catch (Exception ex) {
            log.error("No se pudieron guardar los ajustes administrativos.", ex);
            return toResponse(buildDefaults());
        }
    }

    private AppSettings buildDefaults() {
        AppSettings settings = new AppSettings();
        settings.setId(SETTINGS_ID);
        settings.setSiteName("FisioVida");
        return settings;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String blankToNull(String value) {
        return isBlank(value) ? null : value.trim();
    }

    private Map<String, Object> toResponse(AppSettings settings) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", settings.getId());
        response.put("siteName", settings.getSiteName());
        response.put("logoUrl", settings.getLogoUrl());
        response.put("companyName", settings.getCompanyName());
        response.put("companyEmail", settings.getCompanyEmail());
        response.put("companyPhone", settings.getCompanyPhone());
        response.put("address", settings.getAddress());
        return response;
    }
}
