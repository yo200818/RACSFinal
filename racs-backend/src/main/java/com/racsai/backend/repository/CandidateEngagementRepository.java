package com.racsai.backend.repository;

import com.racsai.backend.entity.CandidateEngagement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidateEngagementRepository extends JpaRepository<CandidateEngagement, String> {
    // Used for Query 65 to view engagement status for a specific candidate
    List<CandidateEngagement> findByCandidate_CandidateIdAndWorkspace_WorkspaceId(String candidateId, String workspaceId);
}