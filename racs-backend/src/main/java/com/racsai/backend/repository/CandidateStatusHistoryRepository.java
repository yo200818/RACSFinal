package com.racsai.backend.repository;

import com.racsai.backend.entity.CandidateStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidateStatusHistoryRepository extends JpaRepository<CandidateStatusHistory, String> {
    
    // Query 48: View Status Audit Trail for a Candidate (ordered newest first)
    List<CandidateStatusHistory> findByCandidate_CandidateIdAndWorkspace_WorkspaceIdOrderByChangedAtDesc(String candidateId, String workspaceId);
}