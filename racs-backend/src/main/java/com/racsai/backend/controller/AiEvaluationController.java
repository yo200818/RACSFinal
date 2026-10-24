package com.racsai.backend.controller;

import com.racsai.backend.entity.AiEvaluation;
import com.racsai.backend.service.AiEvaluationService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/evaluations")
public class AiEvaluationController {

    @Autowired
    private AiEvaluationService aiEvaluationService;

    // POST: System initializes the evaluation record (Query 36)
    @PostMapping("/initialize")
    public ResponseEntity<?> initializeEvaluation(
            @RequestParam String workspaceId,
            @RequestParam String candidateId,
            @RequestParam String jobId) {
        try {
            return ResponseEntity.ok(aiEvaluationService.initializeEvaluation(workspaceId, candidateId, jobId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET: Retrieve data to feed the Gemini Prompt (Query 37)
    @GetMapping("/prompt-payload/{candidateId}")
    public ResponseEntity<?> getPromptPayload(
            @PathVariable String candidateId,
            @RequestParam String workspaceId) {
        try {
            return ResponseEntity.ok(aiEvaluationService.getPromptPayload(workspaceId, candidateId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT: System Webhook saves the final AI result (Queries 38 & 39)
    @PutMapping("/save-result/{candidateId}")
    public ResponseEntity<?> saveResult(
            @PathVariable String candidateId,
            @RequestParam String workspaceId,
            @RequestBody AiResultPayload payload) {
        try {
            AiEvaluation savedResult = aiEvaluationService.saveEvaluationResult(
                    workspaceId, candidateId, payload.getMatchScorePercent(), payload.getApiResponseJson()
            );
            return ResponseEntity.ok(savedResult);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT: Flag a timeout failure (Query 40)
    @PutMapping("/timeout/{candidateId}")
    public ResponseEntity<?> markTimeout(
            @PathVariable String candidateId,
            @RequestParam String workspaceId) {
        try {
            aiEvaluationService.markEvaluationAsFailed(workspaceId, candidateId);
            return ResponseEntity.ok(Map.of("message", "Evaluation flagged as failed."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET: Fetch Candidate Scorecard Dashboard (Query 41)
    @GetMapping("/scorecard/{candidateId}")
    public ResponseEntity<?> getScorecard(
            @PathVariable String candidateId,
            @RequestParam String workspaceId) {
        try {
            return ResponseEntity.ok(aiEvaluationService.getCandidateScorecard(workspaceId, candidateId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET: Batch Retrieve all evaluations for a specific job (Query 42)
    @GetMapping("/job-batch/{jobId}")
    public ResponseEntity<List<AiEvaluation>> getJobScorecards(
            @PathVariable String jobId,
            @RequestParam String workspaceId) {
        return ResponseEntity.ok(aiEvaluationService.getJobScorecards(workspaceId, jobId));
    }

    @Getter
    @Setter
    public static class AiResultPayload {
        private int matchScorePercent;
        private String apiResponseJson;
    }
}