package com.racsai.backend.service;

import com.racsai.backend.entity.AiEvaluation;
import com.racsai.backend.entity.Candidate;
import com.racsai.backend.entity.JobPosting;
import com.racsai.backend.entity.Workspace;
import com.racsai.backend.repository.AiEvaluationRepository;
import com.racsai.backend.repository.CandidateRepository;
import com.racsai.backend.repository.JobPostingRepository;
import com.racsai.backend.repository.WorkspaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiEvaluationService {

    @Autowired
    private AiEvaluationRepository aiEvaluationRepository;
    
    @Autowired
    private CandidateRepository candidateRepository;
    
    @Autowired
    private JobPostingRepository jobPostingRepository;
    
    @Autowired
    private WorkspaceRepository workspaceRepository;

    // Query 36: Initialize Evaluation Record (System)
    public AiEvaluation initializeEvaluation(String workspaceId, String candidateId, String jobId) {
        Workspace workspace = workspaceRepository.findById(workspaceId).orElseThrow();
        Candidate candidate = candidateRepository.findById(candidateId).orElseThrow();
        JobPosting job = jobPostingRepository.findById(jobId).orElseThrow();

        AiEvaluation evaluation = new AiEvaluation();
        evaluation.setWorkspace(workspace);
        evaluation.setCandidate(candidate);
        evaluation.setJobPosting(job);
        evaluation.setMatchScorePercent(0);
        evaluation.setEvaluationStatus("Processing");
        evaluation.setApiResponseJson("{}");

        return aiEvaluationRepository.save(evaluation);
    }

    // Query 37: Retrieve Parsed Resume Text and Job Benchmark for AI Prompt
    public Map<String, Object> getPromptPayload(String workspaceId, String candidateId) {
        Candidate candidate = candidateRepository.findByCandidateIdAndWorkspace_WorkspaceId(candidateId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found."));

        JobPosting job = candidate.getJobPosting();

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("extractedText", candidate.getExtractedText());
        payload.put("requiredSkills", job.getRequiredSkills());
        payload.put("minExperienceYears", job.getMinExperienceYears());
        payload.put("fullDescription", job.getFullDescription());
        return payload;
    }

    // Queries 38 & 39: Store Completed AI Payload and Update Candidate Status
    @Transactional
    public AiEvaluation saveEvaluationResult(String workspaceId, String candidateId, int matchScore, String jsonPayload) {
        AiEvaluation evaluation = aiEvaluationRepository.findByCandidate_CandidateIdAndWorkspace_WorkspaceId(candidateId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Evaluation record not found."));

        // Save AI Scorecard (Query 38)
        evaluation.setMatchScorePercent(matchScore);
        evaluation.setApiResponseJson(jsonPayload);
        evaluation.setEvaluationStatus("Completed");
        aiEvaluationRepository.save(evaluation);

        // Update Candidate Status (Query 39)
        Candidate candidate = evaluation.getCandidate();
        candidate.setProcessingStatus("Evaluated");
        candidateRepository.save(candidate);

        return evaluation;
    }

    // Query 40: Handle AI Processing Failure / Timeout
    public void markEvaluationAsFailed(String workspaceId, String candidateId) {
        AiEvaluation evaluation = aiEvaluationRepository.findByCandidate_CandidateIdAndWorkspace_WorkspaceId(candidateId, workspaceId)
                .orElseThrow();
        evaluation.setEvaluationStatus("Failed - API Timeout");
        aiEvaluationRepository.save(evaluation);
    }

    // Query 41: Fetch Specific Candidate Scorecard (Read-Only)
    public AiEvaluation getCandidateScorecard(String workspaceId, String candidateId) {
        return aiEvaluationRepository.findByCandidate_CandidateIdAndWorkspace_WorkspaceId(candidateId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Scorecard not found."));
    }

    // Query 42: Batch Retrieve Scorecards for Job (Dashboard View)
    public List<AiEvaluation> getJobScorecards(String workspaceId, String jobId) {
        return aiEvaluationRepository.findByJobPosting_JobIdAndWorkspace_WorkspaceIdOrderByMatchScorePercentDesc(jobId, workspaceId);
    }
}