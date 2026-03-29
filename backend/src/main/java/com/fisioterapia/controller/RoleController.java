package com.fisioterapia.controller;

import com.fisioterapia.model.RoleEntity;
import com.fisioterapia.repository.AppUserRepository;
import com.fisioterapia.repository.RoleRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/api/admin/roles")
@PreAuthorize("hasRole('ADMIN')")
public class RoleController {
    private final RoleRepository roleRepository;
    private final AppUserRepository userRepository;

    public RoleController(RoleRepository roleRepository, AppUserRepository userRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<RoleEntity> getAll() {
        return roleRepository.findAll()
                .stream()
                .sorted((a, b) -> a.getName().compareToIgnoreCase(b.getName()))
                .toList();
    }

    @GetMapping("/active")
    public List<RoleEntity> getActive() {
        return roleRepository.findByActiveTrueOrderByNameAsc();
    }

    @PostMapping
    public RoleEntity create(@Valid @RequestBody RoleEntity role) {
        role.setName(normalizeRoleName(role.getName()));

        if (roleRepository.existsByName(role.getName())) {
            throw new ResponseStatusException(BAD_REQUEST, "Ya existe un rol con ese nombre.");
        }

        if (role.getActive() == null) {
            role.setActive(true);
        }

        return roleRepository.save(role);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoleEntity> update(@PathVariable Long id, @Valid @RequestBody RoleEntity role) {
        return roleRepository.findById(id)
                .map(existing -> {
                    String normalizedName = normalizeRoleName(role.getName());
                    roleRepository.findByName(normalizedName)
                            .filter(found -> !found.getId().equals(id))
                            .ifPresent(found -> {
                                throw new ResponseStatusException(BAD_REQUEST, "Ya existe un rol con ese nombre.");
                            });

                    if ("ADMIN".equals(existing.getName()) && !"ADMIN".equals(normalizedName)) {
                        throw new ResponseStatusException(BAD_REQUEST, "El rol ADMIN no puede renombrarse.");
                    }

                    existing.setName(normalizedName);
                    existing.setDescription(role.getDescription());
                    existing.setActive(role.getActive() != null ? role.getActive() : existing.getActive());
                    return ResponseEntity.ok(roleRepository.save(existing));
                })
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Rol no encontrado."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        RoleEntity role = roleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Rol no encontrado."));

        if ("ADMIN".equals(role.getName())) {
            throw new ResponseStatusException(BAD_REQUEST, "El rol ADMIN no puede eliminarse.");
        }

        if (userRepository.countByRole(role.getName()) > 0) {
            throw new ResponseStatusException(BAD_REQUEST, "No puedes eliminar un rol asignado a usuarios.");
        }

        roleRepository.delete(role);
        return ResponseEntity.noContent().build();
    }

    private String normalizeRoleName(String value) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "El nombre del rol es obligatorio.");
        }

        String normalized = value.trim().toUpperCase().replace(' ', '_');
        if (!normalized.matches("[A-Z0-9_]+")) {
            throw new ResponseStatusException(BAD_REQUEST, "El nombre del rol solo puede contener letras, números y guion bajo.");
        }
        return normalized;
    }
}
