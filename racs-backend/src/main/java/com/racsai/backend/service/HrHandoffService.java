package com.racsai.backend.service;

import com.racsai.backend.entity.*;
import com.racsai.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class HrHandoffService {

    @Autowired
    private HrHandoffReportRepository handoffRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private AiEvaluationRepository aiEvaluationRepository;

    @Autowired
    private InterviewChecklistRepository checklistRepository;

    // Query 56: Trigger HR Handoff & Submit Notes (Locks the report)
    public HrHandoffReport createHandoffReport(String workspaceId, String candidateId, String jobId, String hiringManagerId, String finalNotes) {
        Workspace workspace = workspaceRepository.findById(workspaceId).orElseThrow();
        Candidate candidate = candidateRepository.findByCandidateIdAndWorkspace_WorkspaceId(candidateId, workspaceId).orElseThrow();
        JobPosting job = jobPostingRepository.findById(jobId).orElseThrow();
        User manager = userRepository.findById(hiringManagerId).orElseThrow();

        HrHandoffReport report = new HrHandoffReport();
        report.setWorkspace(workspace);
        report.setCandidate(candidate);
        report.setJobPosting(job);
        report.setHiringManager(manager);
        report.setFinalHmNotes(finalNotes);
        report.setReportStatus("Pending HR Review");
        report.setImmutable(true); // Locks the record immediately

        return handoffRepository.save(report);
    }

    // Query 57: Compile Unified Summary Report (HR / Admin View)
    public Map<String, Object> getUnifiedSummaryReport(String workspaceId, String candidateId) {
        HrHandoffReport report = handoffRepository.findByCandidate_CandidateIdAndWorkspace_WorkspaceId(candidateId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Handoff report not found."));
        
        Candidate candidate = report.getCandidate();
        JobPosting job = report.getJobPosting();
        
        // Fetch AI and Interview data safely if they exist
        AiEvaluation aiEvaluation = aiEvaluationRepository.findByCandidate_CandidateIdAndWorkspace_WorkspaceId(candidateId, workspaceId).orElse(null);
        InterviewChecklist checklist = checklistRepository.findByCandidate_CandidateIdAndWorkspace_WorkspaceId(candidateId, workspaceId).orElse(null);

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("candidateName", candidate.getCandidateName());
        summary.put("jobTitle", job.getJobTitle());
        
        if (aiEvaluation != null) {
            summary.put("matchScorePercent", aiEvaluation.getMatchScorePercent());
            summary.put("aiEvaluationJson", aiEvaluation.getApiResponseJson());
        }

        if (checklist != null) {
            summary.put("interviewStatus", checklist.getInterviewStatus());
        }

        summary.put("finalHmNotes", report.getFinalHmNotes());
        summary.put("reportStatus", report.getReportStatus());
        summary.put("approvedOn", report.getCreatedAt());

        return summary;
    }

    // Query 58: Process Offer Workflow (HR Representative)
    public HrHandoffReport processOffer(String workspaceId, String reportId) {
        HrHandoffReport report = handoffRepository.findByReportIdAndWorkspace_WorkspaceId(reportId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found."));

        report.setReportStatus("Offer Processed");
        return handoffRepository.save(report);
    }

    // Query 59: Enforce Immutability Constraint (System Check)
    public HrHandoffReport attemptToEditNotes(String workspaceId, String reportId, String newNotes) {
        HrHandoffReport report = handoffRepository.findByReportIdAndWorkspace_WorkspaceId(reportId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found."));

        if (report.isImmutable()) {
            throw new IllegalStateException("Compliance Error: This report is locked as immutable and cannot be modified.");
        }

        report.setFinalHmNotes(newNotes);
        return handoffRepository.save(report);
    }
}