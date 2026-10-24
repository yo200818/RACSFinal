package com.racsai.backend.controller;

import com.racsai.backend.entity.Workspace;
import com.racsai.backend.service.WorkspaceService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workspaces")
public class WorkspaceController {

    @Autowired
    private WorkspaceService workspaceService;

    // POST: Create Workspace + System Administrator (EP01-US01 / Queries 3, 4, 5)
    @PostMapping("/signup")
    public ResponseEntity<?> signUpWorkspace(@RequestBody WorkspaceSignUpRequest request) {
        try {
            Map<String, Object> result = workspaceService.createWorkspaceAndAdmin(
                    request.getCompanyName(),
                    request.getCompanyAddress(),
                    request.getGstin(),
                    request.getCompanyPhone(),
                    request.getAdminFullName(),
                    request.getAdminEmail(),
                    request.getAdminPassword()
            );
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET: Verify Workspace & Admin Role by Email (Query 6)
    @GetMapping("/verify")
    public ResponseEntity<?> verifyWorkspace(@RequestParam String email) {
        try {
            return ResponseEntity.ok(workspaceService.verifyWorkspaceAndAdminByEmail(email));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET: Retrieve all workspaces
    @GetMapping
    public ResponseEntity<List<Workspace>> getAllWorkspaces() {
        return ResponseEntity.ok(workspaceService.getAllWorkspaces());
    }

    // GET: Retrieve a specific workspace by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getWorkspaceById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(workspaceService.getWorkspaceById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT: Update workspace settings
    @PutMapping("/{id}")
    public ResponseEntity<?> updateWorkspace(@PathVariable String id, @RequestBody Workspace workspaceDetails) {
        try {
            return ResponseEntity.ok(workspaceService.updateWorkspace(id, workspaceDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE: Delete a workspace
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWorkspace(@PathVariable String id) {
        try {
            workspaceService.deleteWorkspace(id);
            return ResponseEntity.ok(Map.of("message", "Workspace deleted successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DTO mapping the exact inputs required in EP01-US01 Additional Input Requirements Matrix
    @Getter
    @Setter
    public static class WorkspaceSignUpRequest {
        // Corporate Info
        private String companyName;
        private String companyAddress;
        private String gstin;
        private String companyPhone;

        // Admin Info
        private String adminFullName;
        private String adminEmail;
        private String adminPassword;
    }
}