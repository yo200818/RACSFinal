package com.racsai.backend.service;

import com.racsai.backend.entity.Candidate;
import com.racsai.backend.entity.JobPosting;
import com.racsai.backend.entity.User;
import com.racsai.backend.entity.Workspace;
import com.racsai.backend.repository.CandidateRepository;
import com.racsai.backend.repository.JobPostingRepository;
import com.racsai.backend.repository.UserRepository;
import com.racsai.backend.repository.WorkspaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;
    
    @Autowired
    private WorkspaceRepository workspaceRepository;
    
    @Autowired
    private JobPostingRepository jobPostingRepository;
    
    @Autowired
    private UserRepository userRepository;

    // Queries 30 & 31: Validate Upload Requirements and Insert Resume Record
    public Candidate uploadResume(String workspaceId, String jobId, String uploadedByUserId, Candidate request) {
        
        // Query 30: System Backend Validation for File Type and Size (Max 5MB)
        String type = request.getFileType().toLowerCase();
        if (!type.equals("pdf") && !type.equals("docx")) {
            throw new IllegalArgumentException("Invalid file format. Only PDF and DOCX are allowed.");
        }
        if (request.getFileSizeKb() > 5120) {
            throw new IllegalArgumentException("File exceeds the 5MB upload limit.");
        }

        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found."));

        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found."));

        User uploader = userRepository.findById(uploadedByUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (!job.getWorkspace().getWorkspaceId().equals(workspaceId) || !uploader.getWorkspace().getWorkspaceId().equals(workspaceId)) {
            throw new IllegalArgumentException("Cross-tenant violation. Job or User does not belong to this workspace.");
        }

        // Query 31: Insert Uploaded Candidate Record
        Candidate candidate = new Candidate();
        candidate.setWorkspace(workspace);
        candidate.setJobPosting(job);
        candidate.setUploadedBy(uploader);
        candidate.setCandidateName(request.getCandidateName());
        candidate.setOriginalFileUrl(request.getOriginalFileUrl());
        candidate.setFileType(type);
        candidate.setFileSizeKb(request.getFileSizeKb());
        candidate.setProcessingStatus("Pending Parsing");
        candidate.setPipelineStatus("New Applied");

        return candidateRepository.save(candidate);
    }

    // Query 32: Save Parsed Text Data (Called automatically after backend processes the PDF)
    public Candidate updateParsedText(String workspaceId, String candidateId, String extractedText) {
        Candidate candidate = candidateRepository.findByCandidateIdAndWorkspace_WorkspaceId(candidateId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found in this workspace."));

        candidate.setExtractedText(extractedText);
        candidate.setProcessingStatus("Parsed Successfully");
        return candidateRepository.save(candidate);
    }

    // Query 33: View Original Resume File URL / Details
    public Candidate getCandidateDetails(String workspaceId, String candidateId) {
        return candidateRepository.findByCandidateIdAndWorkspace_WorkspaceId(candidateId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found in this workspace."));
    }

    // Helper: View all candidates for a specific job
    public List<Candidate> getCandidatesForJob(String workspaceId, String jobId) {
        return candidateRepository.findByJobPosting_JobIdAndWorkspace_WorkspaceIdOrderByCreatedAtDesc(jobId, workspaceId);
    }

    // Query 34: Delete Resume Record from Applicant Pool
    public void deleteCandidate(String workspaceId, String candidateId) {
        Candidate candidate = candidateRepository.findByCandidateIdAndWorkspace_WorkspaceId(candidateId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found in this workspace."));
        
        candidateRepository.delete(candidate);
    }
}