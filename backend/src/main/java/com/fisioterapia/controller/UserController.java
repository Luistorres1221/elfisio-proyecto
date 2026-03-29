package com.fisioterapia.controller;

import com.fisioterapia.model.AppUser;
import com.fisioterapia.model.RoleEntity;
import com.fisioterapia.repository.AppUserRepository;
import com.fisioterapia.repository.RoleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final AppUserRepository repository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(AppUserRepository repository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<UserDto> getAll() {
        return repository.findAll().stream().map(UserDto::from).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getOne(@PathVariable Long id) {
        Optional<AppUser> opt = repository.findById(id);
        return opt.map(u -> ResponseEntity.ok(UserDto.from(u))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public UserDto create(@RequestBody CreateUserRequest request) {
        if (request.email == null || request.email.isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "El correo es obligatorio.");
        }
        if (request.password == null || request.password.isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "La contraseña es obligatoria.");
        }
        if (repository.existsByEmail(request.email.trim())) {
            throw new ResponseStatusException(BAD_REQUEST, "Ya existe un usuario con ese correo.");
        }

        AppUser user = new AppUser();
        user.setEmail(request.email.trim());
        user.setPassword(passwordEncoder.encode(request.password));
        user.setRole(resolveRoleName(request.role));
        return UserDto.from(repository.save(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> update(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        return repository.findById(id).map(existing -> {
            if (request.email != null && !request.email.isBlank()) {
                String normalizedEmail = request.email.trim();
                repository.findByEmail(normalizedEmail)
                        .filter(found -> !found.getId().equals(id))
                        .ifPresent(found -> {
                            throw new ResponseStatusException(BAD_REQUEST, "Ya existe un usuario con ese correo.");
                        });
                existing.setEmail(normalizedEmail);
            }
            if (request.password != null && !request.password.isBlank()) {
                existing.setPassword(passwordEncoder.encode(request.password));
            }
            if (request.role != null) {
                existing.setRole(resolveRoleName(request.role));
            }
            return ResponseEntity.ok(UserDto.from(repository.save(existing)));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    public static class UserDto {
        public Long id;
        public String email;
        public String role;

        public static UserDto from(AppUser user) {
            UserDto dto = new UserDto();
            dto.id = user.getId();
            dto.email = user.getEmail();
            dto.role = user.getRole();
            return dto;
        }
    }

    public static class CreateUserRequest {
        public String email;
        public String password;
        public String role;
    }

    public static class UpdateUserRequest {
        public String email;
        public String password;
        public String role;
    }

    private String resolveRoleName(String requestedRole) {
        String roleName = (requestedRole == null || requestedRole.isBlank())
                ? "USER"
                : requestedRole.trim().toUpperCase();

        RoleEntity role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "El rol seleccionado no existe."));

        if (Boolean.FALSE.equals(role.getActive())) {
            throw new ResponseStatusException(BAD_REQUEST, "El rol seleccionado está inactivo.");
        }

        return role.getName();
    }
}
