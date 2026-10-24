package com.racsai.backend.service;

import com.racsai.backend.entity.Candidate;
import com.racsai.backend.entity.CandidateStatusHistory;
import com.racsai.backend.entity.User;
import com.racsai.backend.entity.Workspace;
import com.racsai.backend.repository.CandidateRepository;
import com.racsai.backend.repository.CandidateStatusHistoryRepository;
import com.racsai.backend.repository.UserRepository;
import com.racsai.backend.repository.WorkspaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PipelineService {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private CandidateStatusHistoryRepository historyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    // Queries 45 & 46: Log history and update candidate status atomically
    @Transactional
    public Candidate updatePipelineStatus(String workspaceId, String candidateId, String userId, String newStatus) {
        if (newStatus == null || newStatus.trim().isEmpty()) {
            throw new IllegalArgumentException("Pipeline status cannot be empty.");
        }

        Workspace workspace = workspaceRepository.findById(workspaceId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        Candidate candidate = candidateRepository.findByCandidateIdAndWorkspace_WorkspaceId(candidateId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found."));

        if (!user.getWorkspace().getWorkspaceId().equals(workspaceId)) {
            throw new IllegalArgumentException("User does not belong to this workspace.");
        }

        String oldStatus = candidate.getPipelineStatus();

        // Query 45: Log Status Change to Audit Trail
        CandidateStatusHistory history = new CandidateStatusHistory();
        history.setWorkspace(workspace);
        history.setCandidate(candidate);
        history.setChangedBy(user);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        historyRepository.save(history);

        // Query 46: Update Candidate Pipeline Status
        candidate.setPipelineStatus(newStatus);
        return candidateRepository.save(candidate);
    }

    // Query 47: Filter Candidates by Pipeline Status
    public List<Candidate> getCandidatesByStatus(String workspaceId, String status) {
        return candidateRepository.findByPipelineStatusAndWorkspace_WorkspaceId(status, workspaceId);
    }

    // Query 48: View Status Audit Trail for a Candidate
    public List<CandidateStatusHistory> getCandidateAuditTrail(String workspaceId, String candidateId) {
        return historyRepository.findByCandidate_CandidateIdAndWorkspace_WorkspaceIdOrderByChangedAtDesc(candidateId, workspaceId);
    }
}