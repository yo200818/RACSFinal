package com.racsai.backend.controller;

import com.racsai.backend.entity.PasswordReset;
import com.racsai.backend.service.AuthService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // POST: User Login (Queries 16 & 17)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Map<String, Object> sessionDetails = authService.login(request.getEmail(), request.getPassword(), request.isRememberMe());
            return ResponseEntity.ok(sessionDetails);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // POST: User Logout (Query 21)
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestParam String sessionToken) {
        try {
            authService.logout(sessionToken);
            return ResponseEntity.ok(Map.of("message", "Logged out successfully. Session invalidated."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // POST: Request Password Reset Link (Query 18)
    @PostMapping("/password-reset/request")
    public ResponseEntity<?> requestPasswordReset(@RequestBody ResetRequest request) {
        try {
            PasswordReset reset = authService.requestPasswordReset(request.getEmail());
            return ResponseEntity.ok(Map.of(
                    "message", "Password reset link generated.",
                    "resetToken", reset.getResetToken(),
                    "resetUrl", "http://localhost:3000/reset-password?token=" + reset.getResetToken(),
                    "expiresAt", reset.getExpiresAt()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET: Validate Reset Link Before Showing New Password Form (Query 19)
    @GetMapping("/password-reset/validate/{token}")
    public ResponseEntity<?> validateResetToken(@PathVariable String token) {
        try {
            authService.validateResetToken(token);
            return ResponseEntity.ok(Map.of("message", "Token is valid. Proceed to reset password."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // POST: Execute Password Reset (Query 20)
    @PostMapping("/password-reset/execute/{token}")
    public ResponseEntity<?> executePasswordReset(@PathVariable String token, @RequestBody ExecuteResetRequest request) {
        try {
            authService.executePasswordReset(token, request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Password reset successfully. You may now log in."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- DTOs ---
    @Getter
    @Setter
    public static class LoginRequest {
        private String email;
        private String password;
        private boolean rememberMe;
    }

    @Getter
    @Setter
    public static class ResetRequest {
        private String email;
    }

    @Getter
    @Setter
    public static class ExecuteResetRequest {
        private String newPassword;
    }
}