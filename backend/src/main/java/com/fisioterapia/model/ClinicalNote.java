package com.fisioterapia.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ClinicalNote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Patient patient;

    @Lob
    private String noteText;

    private LocalDateTime createdAt;

    public ClinicalNote() {
    }

    public ClinicalNote(Patient patient, String noteText) {
        this.patient = patient;
        this.noteText = noteText;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public String getNoteText() {
        return noteText;
    }

    public void setNoteText(String noteText) {
        this.noteText = noteText;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
