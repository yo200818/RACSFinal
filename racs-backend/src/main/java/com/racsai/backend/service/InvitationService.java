package com.racsai.backend.service;

import com.racsai.backend.entity.Invitation;
import com.racsai.backend.entity.User;
import com.racsai.backend.entity.Workspace;
import com.racsai.backend.repository.InvitationRepository;
import com.racsai.backend.repository.UserRepository;
import com.racsai.backend.repository.WorkspaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class InvitationService {

    @Autowired
    private InvitationRepository invitationRepository;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private UserRepository userRepository;

    // Query 8: Generate Role-Specific Invite Link (48-hour expiration)
    public Invitation generateInviteLink(String workspaceId, String createdByUserId, String invitedRole) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found."));

        User admin = userRepository.findById(createdByUserId)
                .orElseThrow(() -> new IllegalArgumentException("Admin user not found."));

        if (!admin.getRole().equalsIgnoreCase("System Administrator")) {
            throw new IllegalArgumentException("Only a System Administrator can generate invitation links.");
        }

        if (!admin.getWorkspace().getWorkspaceId().equals(workspaceId)) {
            throw new IllegalArgumentException("Admin does not belong to the specified workspace.");
        }

        Invitation invite = new Invitation();
        invite.setWorkspace(workspace);
        invite.setCreatedBy(admin);
        invite.setInvitedRole(invitedRole); // e.g., "Talent Acquisition (TA)" or "Hiring Manager (HM)"
        invite.setInviteToken(UUID.randomUUID().toString().replace("-", ""));
        invite.setExpiresAt(LocalDateTime.now().plusHours(48));
        invite.setUsed(false);

        return invitationRepository.save(invite);
    }

    // Query 9: Validate Invite Link (Checks if valid, unused, and not expired)
    public Invitation getValidInvitationOrThrow(String token) {
        Invitation invite = invitationRepository.findByInviteToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid invitation link. Please contact your System Administrator."));

        if (invite.isUsed()) {
            throw new IllegalArgumentException("This invitation link has already been used. Please contact your System Administrator.");
        }

        if (invite.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("This invitation link has expired (48-hour limit). Please contact your System Administrator.");
        }

        return invite;
    }

    // Returns clean metadata for the frontend before showing the Sign Up screen (Query 9)
    public Map<String, Object> validateInviteTokenDetails(String token) {
        Invitation invite = getValidInvitationOrThrow(token);

        Map<String, Object> details = new LinkedHashMap<>();
        details.put("inviteId", invite.getInviteId());
        details.put("workspaceId", invite.getWorkspace().getWorkspaceId());
        details.put("companyName", invite.getWorkspace().getCompanyName());
        details.put("invitedRole", invite.getInvitedRole());
        details.put("expiresAt", invite.getExpiresAt());
        details.put("isUsed", invite.isUsed());
        return details;
    }

    // Query 11: Mark Invitation as Used
    public Invitation markInvitationAsUsed(String token) {
        Invitation invite = invitationRepository.findByInviteToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invitation token not found."));
        invite.setUsed(true);
        return invitationRepository.save(invite);
    }

    // Helper: View all invitations across system
    public List<Invitation> getAllInvitations() {
        return invitationRepository.findAll();
    }

    // Helper: View all invitations for a specific workspace
    public List<Invitation> getInvitationsByWorkspace(String workspaceId) {
        return invitationRepository.findByWorkspace_WorkspaceIdOrderByCreatedAtDesc(workspaceId);
    }
}