package com.racsai.backend.repository;

import com.racsai.backend.entity.PasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetRepository extends JpaRepository<PasswordReset, String> {
    Optional<PasswordReset> findByResetToken(String resetToken);
}