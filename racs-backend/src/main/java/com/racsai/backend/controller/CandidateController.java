package com.racsai.backend.controller;

import com.racsai.backend.entity.Candidate;
import com.racsai.backend.service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    // POST: Upload Candidate Resume (Queries 30 & 31)
    @PostMapping
    public ResponseEntity<?> uploadCandidate(
            @RequestParam String workspaceId,
            @RequestParam String jobId,
            @RequestParam String uploadedByUserId,
            @RequestBody Candidate request) {
        try {
            Candidate savedCandidate = candidateService.uploadResume(workspaceId, jobId, uploadedByUserId, request);
            return ResponseEntity.ok(savedCandidate);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT: Save Extracted Resume Text (Query 32)
    @PutMapping("/{candidateId}/parse")
    public ResponseEntity<?> saveParsedText(
            @PathVariable String candidateId,
            @RequestParam String workspaceId,
            @RequestBody Map<String, String> payload) {
        try {
            Candidate updated = candidateService.updateParsedText(workspaceId, candidateId, payload.get("extractedText"));
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET: View Original Resume Details / URL (Query 33)
    @GetMapping("/{candidateId}")
    public ResponseEntity<?> getCandidate(
            @PathVariable String candidateId,
            @RequestParam String workspaceId) {
        try {
            return ResponseEntity.ok(candidateService.getCandidateDetails(workspaceId, candidateId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET: List all candidates for a specific job
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Candidate>> getCandidatesByJob(
            @PathVariable String jobId,
            @RequestParam String workspaceId) {
        return ResponseEntity.ok(candidateService.getCandidatesForJob(workspaceId, jobId));
    }

    // DELETE: Remove candidate resume (Query 34)
    @DeleteMapping("/{candidateId}")
    public ResponseEntity<?> deleteCandidate(
            @PathVariable String candidateId,
            @RequestParam String workspaceId) {
        try {
            candidateService.deleteCandidate(workspaceId, candidateId);
            return ResponseEntity.ok(Map.of("message", "Candidate resume successfully deleted."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}