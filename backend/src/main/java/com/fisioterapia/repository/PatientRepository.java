package com.fisioterapia.repository;

import com.fisioterapia.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param; // Eliminado porque no se usa
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByDocumentId(String documentId);
    List<Patient> findByFullNameContainingIgnoreCase(String fullName);
    List<Patient> findByPhoneContaining(String phone);
    List<Patient> findByEmailContainingIgnoreCase(String email);
    
    @Query("SELECT COUNT(p) FROM Patient p")
    long countTotalPatients();
}
