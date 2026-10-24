package com.racsai.backend.controller;

import com.racsai.backend.entity.EngagementSequence;
import com.racsai.backend.service.EngagementService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/engagements")
public class EngagementController {

    @Autowired
    private EngagementService engagementService;

    // POST: Configure a new email sequence (Query 62)
    @PostMapping("/sequences")
    public ResponseEntity<?> createSequence(
            @RequestParam String workspaceId,
            @RequestParam String userId,
            @Valid @RequestBody EngagementSequence request) {
        try {
            return ResponseEntity.ok(engagementService.configureSequence(workspaceId, userId, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT: Toggle sequence on/off (Query 63)
    @PutMapping("/sequences/{sequenceId}/toggle")
    public ResponseEntity<?> toggleSequence(
            @PathVariable String sequenceId,
            @RequestParam String workspaceId,
            @RequestBody Map<String, Boolean> payload) {
        try {
            return ResponseEntity.ok(engagementService.toggleSequenceStatus(workspaceId, sequenceId, payload.get("isActive")));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // POST: Trigger auto-enrollment when an offer is accepted (Query 64)
    @PostMapping("/enroll/{candidateId}")
    public ResponseEntity<?> enrollCandidate(
            @PathVariable String candidateId,
            @RequestParam String workspaceId) {
        try {
            engagementService.autoEnrollCandidate(workspaceId, candidateId);
            return ResponseEntity.ok(Map.of("message", "Candidate successfully enrolled in automated sequence."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET: View engagement status for HR Dashboard (Query 65)
    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<?> getEngagementStatus(
            @PathVariable String candidateId,
            @RequestParam String workspaceId) {
        return ResponseEntity.ok(engagementService.getCandidateEngagements(workspaceId, candidateId));
    }
}