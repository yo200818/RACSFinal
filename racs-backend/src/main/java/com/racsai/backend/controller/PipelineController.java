package com.racsai.backend.controller;

import com.racsai.backend.entity.Candidate;
import com.racsai.backend.entity.CandidateStatusHistory;
import com.racsai.backend.service.PipelineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pipeline")
public class PipelineController {

    @Autowired
    private PipelineService pipelineService;

    // PUT: Move candidate to a new stage (Queries 45 & 46)
    @PutMapping("/{candidateId}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String candidateId,
            @RequestParam String workspaceId,
            @RequestParam String userId,
            @RequestBody Map<String, String> payload) {
        try {
            Candidate updated = pipelineService.updatePipelineStatus(
                    workspaceId, candidateId, userId, payload.get("newStatus")
            );
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET: View Kanban Dashboard Column (Query 47)
    @GetMapping("/filter")
    public ResponseEntity<List<Candidate>> filterByStatus(
            @RequestParam String workspaceId,
            @RequestParam String status) {
        return ResponseEntity.ok(pipelineService.getCandidatesByStatus(workspaceId, status));
    }

    // GET: View Candidate Audit Trail (Query 48)
    @GetMapping("/{candidateId}/audit")
    public ResponseEntity<List<CandidateStatusHistory>> getAuditTrail(
            @PathVariable String candidateId,
            @RequestParam String workspaceId) {
        return ResponseEntity.ok(pipelineService.getCandidateAuditTrail(workspaceId, candidateId));
    }
}