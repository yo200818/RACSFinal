package com.racsai.backend.repository;

import com.racsai.backend.entity.EngagementSequence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EngagementSequenceRepository extends JpaRepository<EngagementSequence, String> {
    Optional<EngagementSequence> findBySequenceIdAndWorkspace_WorkspaceId(String sequenceId, String workspaceId);
    
    // Finds the active sequence for a specific workspace to use during auto-enrollment
    List<EngagementSequence> findByWorkspace_WorkspaceIdAndIsActiveTrue(String workspaceId);
}