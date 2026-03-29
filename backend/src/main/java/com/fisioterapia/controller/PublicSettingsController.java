package com.fisioterapia.controller;

import com.fisioterapia.model.AppSettings;
import com.fisioterapia.repository.AppSettingsRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/settings")
public class PublicSettingsController {
    private static final Long SETTINGS_ID = 1L;

    private final AppSettingsRepository repository;

    public PublicSettingsController(AppSettingsRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public AppSettings getSettings() {
        return repository.findById(SETTINGS_ID).orElseGet(this::buildDefaults);
    }

    private AppSettings buildDefaults() {
        AppSettings settings = new AppSettings();
        settings.setId(SETTINGS_ID);
        settings.setSiteName("FisioVida");
        return settings;
    }
}
