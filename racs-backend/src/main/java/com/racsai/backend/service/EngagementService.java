package com.racsai.backend.service;

import com.racsai.backend.entity.*;
import com.racsai.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EngagementService {

    @Autowired
    private EngagementSequenceRepository sequenceRepository;

    @Autowired
    private CandidateEngagementRepository engagementRepository;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    // Query 62: Configure Email Sequence (Engagement Team)
    public EngagementSequence configureSequence(String workspaceId, String userId, EngagementSequence request) {
        Workspace workspace = workspaceRepository.findById(workspaceId).orElseThrow();
        User author = userRepository.findById(userId).orElseThrow();

        if (!author.getWorkspace().getWorkspaceId().equals(workspaceId)) {
            throw new IllegalArgumentException("User does not belong to this workspace.");
        }

        EngagementSequence sequence = new EngagementSequence();
        sequence.setWorkspace(workspace);
        sequence.setCreatedBy(author);
        sequence.setTemplateText(request.getTemplateText());
        sequence.setSequenceTimingDays(request.getSequenceTimingDays());
        sequence.setActive(true);

        return sequenceRepository.save(sequence);
    }

    // Query 63: Toggle Engagement Status On/Off
    public EngagementSequence toggleSequenceStatus(String workspaceId, String sequenceId, boolean isActive) {
        EngagementSequence sequence = sequenceRepository.findBySequenceIdAndWorkspace_WorkspaceId(sequenceId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Sequence not found."));

        sequence.setActive(isActive);
        return sequenceRepository.save(sequence);
    }

    // Query 64: Auto-Enroll Candidate into Sequence (System Trigger)
    @Transactional
    public void autoEnrollCandidate(String workspaceId, String candidateId) {
        Candidate candidate = candidateRepository.findByCandidateIdAndWorkspace_WorkspaceId(candidateId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found."));

        if (!"Offer Accepted".equalsIgnoreCase(candidate.getPipelineStatus())) {
            throw new IllegalStateException("Candidate pipeline status must be 'Offer Accepted' for auto-enrollment.");
        }

        // Find the active sequence for this workspace
        List<EngagementSequence> activeSequences = sequenceRepository.findByWorkspace_WorkspaceIdAndIsActiveTrue(workspaceId);
        if (activeSequences.isEmpty()) {
            throw new IllegalStateException("No active engagement sequence found for this workspace.");
        }

        // Enroll candidate in the active sequence
        CandidateEngagement engagement = new CandidateEngagement();
        engagement.setWorkspace(candidate.getWorkspace());
        engagement.setCandidate(candidate);
        engagement.setSequence(activeSequences.get(0)); // Maps to the first active sequence
        engagement.setEnrollmentStatus("Enrolled");
        
        engagementRepository.save(engagement);
    }

    // Query 65: View Candidate Engagement Status
    public List<CandidateEngagement> getCandidateEngagements(String workspaceId, String candidateId) {
        return engagementRepository.findByCandidate_CandidateIdAndWorkspace_WorkspaceId(candidateId, workspaceId);
    }
}