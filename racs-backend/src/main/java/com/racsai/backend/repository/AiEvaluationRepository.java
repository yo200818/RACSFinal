package com.racsai.backend.repository;

import com.racsai.backend.entity.AiEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AiEvaluationRepository extends JpaRepository<AiEvaluation, String> {

    // Query 41: Fetch Specific Candidate Scorecard (1:1 Relationship)
    Optional<AiEvaluation> findByCandidate_CandidateIdAndWorkspace_WorkspaceId(String candidateId, String workspaceId);

    // Query 42: Batch Retrieve Scorecards for Job Dashboard, ordered by highest match score
    List<AiEvaluation> findByJobPosting_JobIdAndWorkspace_WorkspaceIdOrderByMatchScorePercentDesc(String jobId, String workspaceId);
}