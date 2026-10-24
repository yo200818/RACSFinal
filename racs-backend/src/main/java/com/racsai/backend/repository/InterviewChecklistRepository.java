package com.racsai.backend.repository;

import com.racsai.backend.entity.InterviewChecklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InterviewChecklistRepository extends JpaRepository<InterviewChecklist, String> {
    Optional<InterviewChecklist> findByCandidate_CandidateIdAndWorkspace_WorkspaceId(String candidateId, String workspaceId);
}