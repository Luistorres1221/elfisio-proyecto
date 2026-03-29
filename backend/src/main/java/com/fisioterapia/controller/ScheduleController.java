package com.fisioterapia.controller;

import com.fisioterapia.model.Schedule;
import com.fisioterapia.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('THERAPIST') or hasRole('RECEPCIONISTA')")
    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('THERAPIST')")
    public Schedule createSchedule(@RequestBody @org.springframework.lang.NonNull Schedule schedule) {
        return scheduleRepository.save(schedule);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('THERAPIST') or hasRole('RECEPCIONISTA')")
    public ResponseEntity<Schedule> getScheduleById(@PathVariable Long id) {
        return scheduleRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('THERAPIST')")
    public ResponseEntity<Schedule> updateSchedule(@PathVariable Long id, @RequestBody Schedule scheduleDetails) {
        return scheduleRepository.findById(id)
                .map(schedule -> {
                    schedule.setDate(scheduleDetails.getDate());
                    schedule.setStartTime(scheduleDetails.getStartTime());
                    schedule.setEndTime(scheduleDetails.getEndTime());
                    schedule.setAvailable(scheduleDetails.isAvailable());
                    return ResponseEntity.ok(scheduleRepository.save(schedule));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        if (scheduleRepository.existsById(id)) {
            scheduleRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

