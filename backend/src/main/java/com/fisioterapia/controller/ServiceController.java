package com.fisioterapia.controller;

import com.fisioterapia.model.Service;
import com.fisioterapia.repository.ServiceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/services")
@PreAuthorize("hasRole('ADMIN')")
public class ServiceController {
    private final ServiceRepository repository;

    public ServiceController(ServiceRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Service> getAll() {
        return repository.findAll();
    }

    @GetMapping("/active")
    public List<Service> getActive() {
        return repository.findByActiveTrue();
    }

    @PostMapping
    public ResponseEntity<Service> create(@RequestBody Service service) {
        if (service == null) {
            return ResponseEntity.badRequest().build();
        }
        Service saved = repository.save(service);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Service> getOne(@PathVariable Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        Optional<Service> opt = repository.findById(id);
        return opt.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Service> update(@PathVariable Long id, @RequestBody Service service) {
        if (id == null || service == null) {
            return ResponseEntity.badRequest().build();
        }
        Optional<Service> opt = repository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Service existing = opt.get();
        existing.setName(service.getName());
        existing.setDescription(service.getDescription());
        existing.setDurationMinutes(service.getDurationMinutes());
        existing.setPrice(service.getPrice());
        existing.setActive(service.getActive());
        Service saved = repository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public List<Service> search(@RequestParam String name) {
        return repository.findByNameContainingIgnoreCase(name);
    }
}
