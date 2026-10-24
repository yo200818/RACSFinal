package com.racsai.backend.service;

import com.racsai.backend.entity.Invitation;
import com.racsai.backend.entity.User;
import com.racsai.backend.entity.Workspace;
import com.racsai.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InvitationService invitationService;

    // Query 5: Insert System Administrator Details (called during Task 01 Workspace Sign Up)
    public User createAdminUser(Workspace workspace, String fullName, String email, String rawPassword) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        User admin = new User();
        admin.setWorkspace(workspace);
        admin.setFullName(fullName);
        admin.setEmail(email);
        admin.setPasswordHash(hashPasswordSha256(rawPassword));
        admin.setRole("System Administrator");
        admin.setAccessStatus("Active");

        return userRepository.save(admin);
    }

    // Query 6: Verify Workspace Sign Up and Admin Role
    public Map<String, Object> verifyAdminByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("No user found with email: " + email));

        Workspace workspace = user.getWorkspace();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("workspaceId", workspace.getWorkspaceId());
        response.put("companyName", workspace.getCompanyName());
        response.put("gstin", workspace.getGstin());
        response.put("userId", user.getUserId());
        response.put("fullName", user.getFullName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("accessStatus", user.getAccessStatus());
        response.put("createdAt", workspace.getCreatedAt());
        return response;
    }

    // Queries 9, 10, & 11: Sign Up TA/HM User via Invite & Mark Invitation as Used
    @Transactional
    public User signUpWithInvite(String token, String fullName, String email, String rawPassword) {
        // Query 9: Validate token via InvitationService
        Invitation invite = invitationService.getValidInvitationOrThrow(token);

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("An account with this work email already exists.");
        }

        // Query 10: Save new TA/HM user linked to Admin's workspace and embedded role
        User newUser = new User();
        newUser.setWorkspace(invite.getWorkspace());
        newUser.setFullName(fullName);
        newUser.setEmail(email);
        newUser.setPasswordHash(hashPasswordSha256(rawPassword));
        newUser.setRole(invite.getInvitedRole());
        newUser.setAccessStatus("Active");

        User savedUser = userRepository.save(newUser);

        // Query 11: Mark Invitation as Used via InvitationService
        invitationService.markInvitationAsUsed(token);

        return savedUser;
    }

    // Query 12: View Team Directory ordered by created_at DESC
    public List<User> getTeamDirectory(String workspaceId) {
        return userRepository.findByWorkspace_WorkspaceIdOrderByCreatedAtDesc(workspaceId);
    }

    // Query 13: Revoke User Access (Sets access_status = 'Revoked')
    public User revokeUserAccess(String workspaceId, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (!user.getWorkspace().getWorkspaceId().equals(workspaceId)) {
            throw new IllegalArgumentException("User does not belong to this workspace.");
        }

        user.setAccessStatus("Revoked");
        return userRepository.save(user);
    }

    // SHA-256 One-Way Hashing (Matches MySQL SHA2(..., 256))
    public String hashPasswordSha256(String rawPassword) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(rawPassword.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(encodedHash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
}