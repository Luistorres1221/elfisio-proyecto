package com.fisioterapia.repository;

import com.fisioterapia.model.ClinicalNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClinicalNoteRepository extends JpaRepository<ClinicalNote, Long> {
    @Query("SELECT n FROM ClinicalNote n WHERE n.patient.id = :patientId ORDER BY n.createdAt DESC")
    List<ClinicalNote> findByPatientId(@Param("patientId") Long patientId);
}
