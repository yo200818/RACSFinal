package com.racsai.backend.repository;

import com.racsai.backend.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, String> {
    
    // Used for Query 3 validation (Duplicate GSTIN check)
    boolean existsByGstin(String gstin);
    
    Optional<Workspace> findByGstin(String gstin);
}