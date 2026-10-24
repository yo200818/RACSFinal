package com.racsai.backend.repository;

import com.racsai.backend.entity.LoginSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoginSessionRepository extends JpaRepository<LoginSession, String> {
    Optional<LoginSession> findBySessionToken(String sessionToken);
}