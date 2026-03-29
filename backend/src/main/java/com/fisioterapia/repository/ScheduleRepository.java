package com.fisioterapia.repository;

import com.fisioterapia.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    @Query("SELECT s FROM Schedule s WHERE s.therapist.id = :therapistId AND s.date = :date")
    List<Schedule> findByTherapistIdAndDate(@Param("therapistId") Long therapistId, @Param("date") LocalDate date);

    @Query("SELECT s FROM Schedule s WHERE s.therapist.id = :therapistId AND s.date = :date AND s.available = :available")
    List<Schedule> findByTherapistIdAndDateAndAvailable(
            @Param("therapistId") Long therapistId,
            @Param("date") LocalDate date,
            @Param("available") boolean available
    );

    @Query("SELECT s FROM Schedule s WHERE s.therapist.id = :therapistId AND s.date = :date AND s.startTime <= :time AND s.endTime > :time AND s.available = true")
    List<Schedule> findAvailableSlots(@Param("therapistId") Long therapistId, @Param("date") LocalDate date, @Param("time") LocalTime time);
}
