package com.fisioterapia.repository;

import com.fisioterapia.model.Appointment;
import com.fisioterapia.model.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByStatus(AppointmentStatus status);
    
    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId")
    List<Appointment> findByPatientId(@Param("patientId") Long patientId);

    List<Appointment> findByAppointmentTimeBetween(LocalDateTime start, LocalDateTime end);
    
    @Query(value = "SELECT COUNT(*) FROM appointments a WHERE CAST(a.appointment_time AS DATE) = CURRENT_DATE", nativeQuery = true)
    long countTodayAppointments();
    
    @Query(value = "SELECT COUNT(*) FROM appointments a WHERE a.status = :status AND CAST(a.appointment_time AS DATE) = CURRENT_DATE", nativeQuery = true)
    long countTodayAppointmentsByStatus(@Param("status") AppointmentStatus status);
    
    @Query("SELECT COUNT(DISTINCT a) FROM Appointment a WHERE a.status != 'CANCELLED'")
    long countActiveAppointments();
}
