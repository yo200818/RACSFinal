package com.racsai.backend.service;

import com.racsai.backend.entity.LoginSession;
import com.racsai.backend.entity.PasswordReset;
import com.racsai.backend.entity.User;
import com.racsai.backend.repository.LoginSessionRepository;
import com.racsai.backend.repository.PasswordResetRepository;
import com.racsai.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LoginSessionRepository loginSessionRepository;

    @Autowired
    private PasswordResetRepository passwordResetRepository;

    // Queries 16 & 17: Verify Credentials and Create Session
    public Map<String, Object> login(String email, String rawPassword, boolean rememberMe) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        String hashedAttempt = hashPasswordSha256(rawPassword);
        
        // Query 16: Check password and verify access_status is 'Active'
        if (!user.getPasswordHash().equals(hashedAttempt)) {
            throw new IllegalArgumentException("Invalid email or password.");
        }
        if (!"Active".equalsIgnoreCase(user.getAccessStatus())) {
            throw new IllegalArgumentException("Your access has been revoked. Please contact your System Administrator.");
        }

        // Query 17: Create Secure Session
        LoginSession session = new LoginSession();
        session.setUser(user);
        session.setSessionToken(UUID.randomUUID().toString().replace("-", ""));
        
        // If Remember Me = true (30 days), else (2 hours)
        session.setExpiresAt(rememberMe ? LocalDateTime.now().plusDays(30) : LocalDateTime.now().plusHours(2));
        session.setActive(true);

        loginSessionRepository.save(session);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("sessionToken", session.getSessionToken());
        response.put("userId", user.getUserId());
        response.put("workspaceId", user.getWorkspace().getWorkspaceId());
        response.put("fullName", user.getFullName());
        response.put("role", user.getRole());
        response.put("expiresAt", session.getExpiresAt());

        return response;
    }

    // Query 21: User Logout (Invalidate Session)
    public void logout(String sessionToken) {
        LoginSession session = loginSessionRepository.findBySessionToken(sessionToken)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or missing session token."));

        if (session.isActive()) {
            session.setActive(false);
            session.setLogoutTime(LocalDateTime.now());
            loginSessionRepository.save(session);
        }
    }

    // Query 18: Request Account Recovery (1-hour expiration)
    public PasswordReset requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("No active account found with this email."));

        if (!"Active".equalsIgnoreCase(user.getAccessStatus())) {
            throw new IllegalArgumentException("Cannot reset password for a revoked account.");
        }

        PasswordReset reset = new PasswordReset();
        reset.setUser(user);
        reset.setResetToken(UUID.randomUUID().toString().replace("-", ""));
        reset.setExpiresAt(LocalDateTime.now().plusHours(1));
        reset.setUsed(false);

        return passwordResetRepository.save(reset);
    }

    // Query 19: Validate Password Reset Link
    public void validateResetToken(String token) {
        PasswordReset reset = passwordResetRepository.findByResetToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid password reset link."));

        if (reset.isUsed()) {
            throw new IllegalArgumentException("This reset link has already been used.");
        }
        if (reset.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("This reset link has expired (1-hour limit). Please request a new one.");
        }
    }

    // Query 20: Execute Password Reset & Invalidate Token
    @Transactional
    public void executePasswordReset(String token, String newRawPassword) {
        validateResetToken(token); // Re-run validation for security

        PasswordReset reset = passwordResetRepository.findByResetToken(token).get();
        User user = reset.getUser();

        // Step 1: Update the user's password
        user.setPasswordHash(hashPasswordSha256(newRawPassword));
        userRepository.save(user);

        // Step 2: Mark token as used
        reset.setUsed(true);
        passwordResetRepository.save(reset);
    }

    // SHA-256 Hash helper method
    private String hashPasswordSha256(String rawPassword) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(rawPassword.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(encodedHash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
}