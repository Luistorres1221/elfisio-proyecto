package com.fisioterapia.repository;

import com.fisioterapia.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);
    Optional<AppUser> findByVerificationToken(String verificationToken);
    boolean existsByEmail(String email);
    long countByRole(String role);
}
