package com.racsai.backend.controller;

import com.racsai.backend.entity.HrHandoffReport;
import com.racsai.backend.service.HrHandoffService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/handoffs")
public class HrHandoffController {

    @Autowired
    private HrHandoffService handoffService;

    // POST: Create immutable handoff report (Query 56)
    @PostMapping
    public ResponseEntity<?> createHandoff(
            @RequestParam String workspaceId,
            @RequestParam String candidateId,
            @RequestParam String jobId,
            @RequestParam String hiringManagerId,
            @RequestBody HandoffRequest request) {
        try {
            HrHandoffReport report = handoffService.createHandoffReport(
                    workspaceId, candidateId, jobId, hiringManagerId, request.getFinalHmNotes()
            );
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET: Retrieve the Unified Summary Report (Query 57)
    @GetMapping("/candidate/{candidateId}/summary")
    public ResponseEntity<?> getSummaryReport(
            @PathVariable String candidateId,
            @RequestParam String workspaceId) {
        try {
            return ResponseEntity.ok(handoffService.getUnifiedSummaryReport(workspaceId, candidateId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT: HR processes the offer (Query 58)
    @PutMapping("/{reportId}/process")
    public ResponseEntity<?> processOffer(
            @PathVariable String reportId,
            @RequestParam String workspaceId) {
        try {
            return ResponseEntity.ok(handoffService.processOffer(workspaceId, reportId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT: Attempt to edit notes (Will trigger Query 59 immutability rejection)
    @PutMapping("/{reportId}/notes")
    public ResponseEntity<?> editNotes(
            @PathVariable String reportId,
            @RequestParam String workspaceId,
            @RequestBody HandoffRequest request) {
        try {
            return ResponseEntity.ok(handoffService.attemptToEditNotes(workspaceId, reportId, request.getFinalHmNotes()));
        } catch (IllegalStateException | IllegalArgumentException e) {
            // Returns a 403 Forbidden to reflect the compliance block
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        }
    }

    // DTO
    @Getter
    @Setter
    public static class HandoffRequest {
        private String finalHmNotes;
    }
}