package com.racsai.backend.controller;

import com.racsai.backend.entity.Invitation;
import com.racsai.backend.service.InvitationService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invitations")
public class InvitationController {

    @Autowired
    private InvitationService invitationService;

    // POST (Query 8): Admin generates a role-specific 48-hour invite link
    @PostMapping("/generate")
    public ResponseEntity<?> generateInvite(@RequestBody GenerateInviteRequest request) {
        try {
            Invitation invite = invitationService.generateInviteLink(
                    request.getWorkspaceId(),
                    request.getCreatedByUserId(),
                    request.getInvitedRole()
            );

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("inviteId", invite.getInviteId());
            response.put("workspaceId", invite.getWorkspace().getWorkspaceId());
            response.put("invitedRole", invite.getInvitedRole());
            response.put("inviteToken", invite.getInviteToken());
            response.put("inviteUrl", "http://localhost:3000/signup?token=" + invite.getInviteToken());
            response.put("expiresAt", invite.getExpiresAt());
            response.put("createdBy", invite.getCreatedBy().getUserId());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET (Query 9): Validate invite token before rendering the Sign Up page
    @GetMapping("/validate/{token}")
    public ResponseEntity<?> validateInviteToken(@PathVariable String token) {
        try {
            return ResponseEntity.ok(invitationService.validateInviteTokenDetails(token));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET: List all generated invitations (for testing/admin debugging)
    @GetMapping
    public ResponseEntity<List<Invitation>> getAllInvitations(@RequestParam(required = false) String workspaceId) {
        if (workspaceId != null && !workspaceId.isBlank()) {
            return ResponseEntity.ok(invitationService.getInvitationsByWorkspace(workspaceId));
        }
        return ResponseEntity.ok(invitationService.getAllInvitations());
    }

    @Getter
    @Setter
    public static class GenerateInviteRequest {
        private String workspaceId;
        private String createdByUserId;
        private String invitedRole;
    }
}