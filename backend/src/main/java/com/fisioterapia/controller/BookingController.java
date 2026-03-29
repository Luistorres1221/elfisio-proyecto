package com.fisioterapia.controller;

import com.fisioterapia.model.Booking;
import com.fisioterapia.model.BookingStatus;
import com.fisioterapia.repository.BookingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingRepository repository;

    public BookingController(BookingRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Booking> getAll() {
        return repository.findAll();
    }

    @GetMapping("/status/{status}")
    public List<Booking> getByStatus(@PathVariable String status) {
        try {
            BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
            return repository.findByStatus(bookingStatus);
        } catch (IllegalArgumentException e) {
            return List.of();
        }
    }

    @PostMapping
    public ResponseEntity<Booking> create(@RequestBody Booking booking) {
        if (booking == null) {
            return ResponseEntity.badRequest().build();
        }
        Booking saved = repository.save(booking);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getOne(@PathVariable Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        Optional<Booking> opt = repository.findById(id);
        return opt.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Booking> update(@PathVariable Long id, @RequestBody Booking booking) {
        if (id == null || booking == null) {
            return ResponseEntity.badRequest().build();
        }
        Optional<Booking> opt = repository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Booking existing = opt.get();
        existing.setName(booking.getName());
        existing.setAppointmentTime(booking.getAppointmentTime());
        Booking saved = repository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateStatus(@PathVariable Long id, @RequestParam String status) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        Optional<Booking> opt = repository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        try {
            BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
            Booking existing = opt.get();
            existing.setStatus(bookingStatus);
            Booking saved = repository.save(existing);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
