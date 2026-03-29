package com.fisioterapia.controller;

import com.fisioterapia.model.Patient;
import com.fisioterapia.repository.PatientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/patients")
public class PatientController {
    private final PatientRepository repository;

    public PatientController(PatientRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
    public List<Patient> getAll() {
        return repository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
    public ResponseEntity<Patient> create(@RequestBody Patient patient) {
        if (patient == null) {
            return ResponseEntity.badRequest().build();
        }
        Patient saved = repository.save(patient);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
    @SuppressWarnings("null")
    public ResponseEntity<Patient> getOne(@PathVariable Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        Optional<Patient> opt = repository.findById(id);
        return opt.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
    @SuppressWarnings("null")
    public ResponseEntity<Patient> update(@PathVariable Long id, @RequestBody Patient patient) {
        if (id == null || patient == null) {
            return ResponseEntity.badRequest().build();
        }
        Optional<Patient> opt = repository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Patient existing = opt.get();
        existing.setFullName(patient.getFullName());
        existing.setDocumentId(patient.getDocumentId());
        existing.setPhone(patient.getPhone());
        existing.setEmail(patient.getEmail());
        existing.setAge(patient.getAge());
        existing.setMedicalObservations(patient.getMedicalObservations());
        Patient saved = repository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SuppressWarnings("null")
    public ResponseEntity<?> delete(@PathVariable Long id) {
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
    @PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
    @SuppressWarnings("null")
    public List<Patient> search(@RequestParam(required = false) String name,
                                @RequestParam(required = false) String document,
                                @RequestParam(required = false) String phone) {
        if (name != null && !name.isEmpty()) {
            return repository.findByFullNameContainingIgnoreCase(name);
        }
        if (document != null && !document.isEmpty()) {
            Optional<Patient> opt = repository.findByDocumentId(document);
            return opt.map(List::of).orElse(List.of());
        }
        if (phone != null && !phone.isEmpty()) {
            return repository.findByPhoneContaining(phone);
        }
        return repository.findAll();
    }

    @GetMapping("/count")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
    public long count() {
        return repository.countTotalPatients();
    }
}

