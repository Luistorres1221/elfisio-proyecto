package com.fisioterapia.controller;

import com.fisioterapia.controller.dto.AppointmentStatsResponse;
import com.fisioterapia.model.Appointment;
import com.fisioterapia.model.AppointmentStatus;
import com.fisioterapia.repository.AppointmentRepository;
import com.fisioterapia.repository.PatientRepository;
import com.fisioterapia.repository.ServiceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@RestController
@RequestMapping("/api/admin/appointments")
public class AppointmentController {
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final ServiceRepository serviceRepository;

    public AppointmentController(AppointmentRepository appointmentRepository,
                                PatientRepository patientRepository,
                                ServiceRepository serviceRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.serviceRepository = serviceRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
    public List<Appointment> getAll() {
        return appointmentRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
    public ResponseEntity<?> create(@RequestBody AppointmentRequest request) {
        if (request.getPatientId() == null || request.getServiceId() == null || request.getAppointmentTime() == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Paciente, servicio y fecha son obligatorios.");
        }

        Optional<com.fisioterapia.model.Patient> patient = patientRepository.findById(request.getPatientId());
        Optional<com.fisioterapia.model.Service> service = serviceRepository.findById(request.getServiceId());
        if (patient.isEmpty() || service.isEmpty()) {
            throw new ResponseStatusException(BAD_REQUEST, "Paciente o servicio no encontrado.");
        }

        Appointment appointment = new Appointment(patient.get(), service.get(), request.getAppointmentTime());
        appointment.setNotes(request.getNotes());
        appointment.setStatus(parseStatus(request.getStatus()));
        return ResponseEntity.ok(appointmentRepository.save(appointment));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
    public ResponseEntity<Appointment> getOne(@PathVariable Long id) {
        Optional<Appointment> opt = appointmentRepository.findById(id);
        return opt.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
    public ResponseEntity<Appointment> update(@PathVariable Long id, @RequestBody AppointmentRequest request) {
        return appointmentRepository.findById(id)
                .map(existing -> {
                    if (request.getAppointmentTime() != null) {
                        existing.setAppointmentTime(request.getAppointmentTime());
                    }
                    existing.setStatus(parseStatus(request.getStatus()));
                    existing.setNotes(request.getNotes());
                    return ResponseEntity.ok(appointmentRepository.save(existing));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (appointmentRepository.existsById(id)) {
            appointmentRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
    public ResponseEntity<Appointment> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return appointmentRepository.findById(id)
                .map(existing -> {
                    existing.setStatus(parseStatus(status));
                    return ResponseEntity.ok(appointmentRepository.save(existing));
                }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
    public List<Appointment> getByPatient(@PathVariable Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
    public List<Appointment> getByDateRange(@RequestParam String startDate, @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        return appointmentRepository.findByAppointmentTimeBetween(start, end);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
    public List<Appointment> getByStatus(@PathVariable String status) {
        return appointmentRepository.findByStatus(parseStatus(status));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
    public AppointmentStatsResponse getStats() {
        return new AppointmentStatsResponse(
            appointmentRepository.countTodayAppointments(),
            appointmentRepository.countTodayAppointmentsByStatus(AppointmentStatus.CONFIRMED),
            appointmentRepository.countTodayAppointmentsByStatus(AppointmentStatus.PENDING),
            appointmentRepository.countTodayAppointmentsByStatus(AppointmentStatus.CANCELLED)
        );
    }

    // Inner class for request
    public static class AppointmentRequest {
        private Long patientId;
        private Long serviceId;
        private LocalDateTime appointmentTime;
        private String status = "PENDING";
        private String notes;

        // Getters and Setters
        public Long getPatientId() { return patientId; }
        public void setPatientId(Long patientId) { this.patientId = patientId; }

        public Long getServiceId() { return serviceId; }
        public void setServiceId(Long serviceId) { this.serviceId = serviceId; }

        public LocalDateTime getAppointmentTime() { return appointmentTime; }
        public void setAppointmentTime(LocalDateTime appointmentTime) { this.appointmentTime = appointmentTime; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    private AppointmentStatus parseStatus(String status) {
        String normalized = (status == null || status.isBlank()) ? "PENDING" : status.trim().toUpperCase();

        try {
            return AppointmentStatus.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(BAD_REQUEST, "Estado de cita no valido: " + status);
        }
    }
}

