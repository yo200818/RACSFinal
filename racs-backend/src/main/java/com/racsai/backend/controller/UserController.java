package com.racsai.backend.controller;

import com.racsai.backend.entity.User;
import com.racsai.backend.service.UserService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // GET (Query 6): Verify Admin & Workspace by email
    @GetMapping("/verify")
    public ResponseEntity<?> verifyAdmin(@RequestParam String email) {
        try {
            return ResponseEntity.ok(userService.verifyAdminByEmail(email));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // POST (Queries 10 & 11): TA/HM signs up using invite token
    @PostMapping("/signup/{token}")
    public ResponseEntity<?> signUpViaInvite(@PathVariable String token, @RequestBody InviteSignUpRequest request) {
        try {
            User newUser = userService.signUpWithInvite(
                    token,
                    request.getFullName(),
                    request.getEmail(),
                    request.getPassword()
            );
            return ResponseEntity.ok(newUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET (Query 12): View Team Directory for a workspace
    @GetMapping("/directory/{workspaceId}")
    public ResponseEntity<List<User>> getTeamDirectory(@PathVariable String workspaceId) {
        return ResponseEntity.ok(userService.getTeamDirectory(workspaceId));
    }

    // PUT (Query 13): Revoke User Access
    @PutMapping("/{userId}/revoke")
    public ResponseEntity<?> revokeAccess(@PathVariable String userId, @RequestParam String workspaceId) {
        try {
            User revokedUser = userService.revokeUserAccess(workspaceId, userId);
            return ResponseEntity.ok(Map.of(
                    "message", "User access revoked. Historical resumes and jobs remain intact.",
                    "user", revokedUser
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @Getter
    @Setter
    public static class InviteSignUpRequest {
        private String fullName;
        private String email;
        private String password;
    }
}