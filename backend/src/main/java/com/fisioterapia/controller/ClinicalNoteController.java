package com.fisioterapia.controller;

import com.fisioterapia.model.ClinicalNote;
import com.fisioterapia.model.Patient;
import com.fisioterapia.repository.ClinicalNoteRepository;
import com.fisioterapia.repository.PatientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/clinical-notes")
public class ClinicalNoteController {
    private final ClinicalNoteRepository noteRepository;
    private final PatientRepository patientRepository;

    public ClinicalNoteController(ClinicalNoteRepository noteRepository, PatientRepository patientRepository) {
        this.noteRepository = noteRepository;
        this.patientRepository = patientRepository;
    }
    @GetMapping("/{patientId}")
        public List<ClinicalNote> getByPatient(@PathVariable Long patientId) {
            if (patientId == null) {
                return List.of();
            }
            return noteRepository.findByPatientId(patientId);
        }

    @PostMapping
        public ResponseEntity<ClinicalNote> create(@RequestBody NoteRequest request) {
            Long patientId = request.getPatientId();
            if (patientId == null) {
                return ResponseEntity.badRequest().build();
            }
            Optional<Patient> patientOpt = patientRepository.findById(patientId);
            if (patientOpt.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            ClinicalNote note = new ClinicalNote(patientOpt.get(), request.getNoteText());
            noteRepository.save(note);
            return ResponseEntity.ok(note);
        }

    @DeleteMapping("/{id}")
        public ResponseEntity<Void> delete(@PathVariable Long id) {
            if (id == null) {
                return ResponseEntity.badRequest().build();
            }
            if (noteRepository.existsById(id)) {
                noteRepository.deleteById(id);
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        }

    public static class NoteRequest {
        private Long patientId;
        private String noteText;

        public Long getPatientId() {
            return patientId;
        }

        public void setPatientId(Long patientId) {
            this.patientId = patientId;
        }

        public String getNoteText() {
            return noteText;
        }

        public void setNoteText(String noteText) {
            this.noteText = noteText;
        }
    }
}
