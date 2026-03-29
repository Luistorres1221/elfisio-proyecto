package com.fisioterapia.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "schedules")
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "therapist_id", nullable = false)
    private AppUser therapist;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private boolean available = true;

    public Schedule() {}

    public Schedule(AppUser therapist, LocalDate date, LocalTime startTime, LocalTime endTime) {
        this.therapist = therapist;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.available = true;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public AppUser getTherapist() { return therapist; }
    public void setTherapist(AppUser therapist) { this.therapist = therapist; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}