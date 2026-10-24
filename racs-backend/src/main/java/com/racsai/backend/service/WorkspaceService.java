package com.racsai.backend.service;

import com.racsai.backend.entity.User;
import com.racsai.backend.entity.Workspace;
import com.racsai.backend.repository.UserRepository;
import com.racsai.backend.repository.WorkspaceRepository;
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
public class WorkspaceService {

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private UserRepository userRepository;

    // Executes Queries 3, 4, and 5 in a single transaction
    @Transactional
    public Map<String, Object> createWorkspaceAndAdmin(
            String companyName,
            String companyAddress,
            String gstin,
            String companyPhone,
            String adminFullName,
            String adminEmail,
            String adminPassword) {

        // 1. Validate mandatory fields (EP01-US01 Acceptance Criteria)
        if (isBlank(companyName) || isBlank(companyAddress) || isBlank(gstin) ||
            isBlank(companyPhone) || isBlank(adminFullName) || isBlank(adminEmail) || isBlank(adminPassword)) {
            throw new IllegalArgumentException("All corporate and administrator fields are mandatory.");
        }

        // 2. Query 3: Check Duplicate Email or GSTIN Before Sign Up
        if (workspaceRepository.existsByGstin(gstin)) {
            throw new IllegalArgumentException("A workspace with this GSTIN already exists.");
        }
        if (userRepository.existsByEmail(adminEmail)) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        // 3. Query 4: Insert Corporate Details (Create Private Workspace)
        Workspace workspace = new Workspace();
        workspace.setCompanyName(companyName);
        workspace.setCompanyAddress(companyAddress);
        workspace.setGstin(gstin);
        workspace.setCompanyPhone(companyPhone);
        Workspace savedWorkspace = workspaceRepository.save(workspace);

        // 4. Query 5: Insert System Administrator Details with SHA-256 Hashing
        User adminUser = new User();
        adminUser.setWorkspace(savedWorkspace);
        adminUser.setFullName(adminFullName);
        adminUser.setEmail(adminEmail);
        adminUser.setPasswordHash(hashPasswordSha256(adminPassword));
        adminUser.setRole("System Administrator");
        adminUser.setAccessStatus("Active");
        User savedAdmin = userRepository.save(adminUser);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("workspaceId", savedWorkspace.getWorkspaceId());
        response.put("companyName", savedWorkspace.getCompanyName());
        response.put("gstin", savedWorkspace.getGstin());
        response.put("adminUserId", savedAdmin.getUserId());
        response.put("adminFullName", savedAdmin.getFullName());
        response.put("adminEmail", savedAdmin.getEmail());
        response.put("role", savedAdmin.getRole());
        response.put("accessStatus", savedAdmin.getAccessStatus());
        response.put("createdAt", savedWorkspace.getCreatedAt());

        return response;
    }

    // Query 6: Verify Workspace Registration and Admin Role by Admin Email
    public Map<String, Object> verifyWorkspaceAndAdminByEmail(String email) {
        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No user found with email: " + email));

        Workspace workspace = admin.getWorkspace();

        Map<String, Object> verificationResult = new LinkedHashMap<>();
        verificationResult.put("workspaceId", workspace.getWorkspaceId());
        verificationResult.put("companyName", workspace.getCompanyName());
        verificationResult.put("gstin", workspace.getGstin());
        verificationResult.put("fullName", admin.getFullName());
        verificationResult.put("email", admin.getEmail());
        verificationResult.put("role", admin.getRole());
        verificationResult.put("createdAt", workspace.getCreatedAt());

        return verificationResult;
    }

    public List<Workspace> getAllWorkspaces() {
        return workspaceRepository.findAll();
    }

    public Workspace getWorkspaceById(String id) {
        return workspaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workspace not found with id: " + id));
    }

    public Workspace updateWorkspace(String id, Workspace workspaceDetails) {
        Workspace workspace = getWorkspaceById(id);
        workspace.setCompanyName(workspaceDetails.getCompanyName());
        workspace.setCompanyAddress(workspaceDetails.getCompanyAddress());
        workspace.setCompanyPhone(workspaceDetails.getCompanyPhone());
        return workspaceRepository.save(workspace);
    }

    public void deleteWorkspace(String id) {
        Workspace workspace = getWorkspaceById(id);
        workspaceRepository.delete(workspace);
    }

    // Helper: Matches MySQL SHA2('password', 256) from Query 5
    public String hashPasswordSha256(String rawPassword) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(rawPassword.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(encodedHash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }

    private boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }
}