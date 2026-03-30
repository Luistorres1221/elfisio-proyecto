package com.fisioterapia.controller;

import com.fisioterapia.model.AppSettings;
import com.fisioterapia.repository.AppSettingsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
public class PublicSettingsController {
    private static final Long SETTINGS_ID = 1L;
    private static final Logger log = LoggerFactory.getLogger(PublicSettingsController.class);

    private final AppSettingsRepository repository;

    public PublicSettingsController(AppSettingsRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public Map<String, Object> getSettings() {
        try {
            AppSettings settings = repository.findById(SETTINGS_ID).orElseGet(this::buildDefaults);
            return toResponse(settings);
        } catch (Exception ex) {
            log.error("No se pudieron cargar los ajustes publicos. Se devolveran valores por defecto.", ex);
            return toResponse(buildDefaults());
        }
    }

    private AppSettings buildDefaults() {
        AppSettings settings = new AppSettings();
        settings.setId(SETTINGS_ID);
        settings.setSiteName("FisioVida");
        return settings;
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
