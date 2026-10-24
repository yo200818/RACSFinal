package com.racsai.backend.controller;

import com.racsai.backend.entity.InterviewChecklist;
import com.racsai.backend.entity.InterviewQuestion;
import com.racsai.backend.service.InterviewService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    // POST: Create Checklist & Save AI Questions (Queries 51 & 52)
    @PostMapping("/generate")
    public ResponseEntity<?> generateChecklist(
            @RequestParam String workspaceId,
            @RequestParam String candidateId,
            @RequestParam String jobId,
            @RequestParam String generatedByUserId,
            @RequestBody GenerateQuestionsRequest request) {
        try {
            InterviewChecklist checklist = interviewService.generateInterviewChecklist(
                    workspaceId, candidateId, jobId, generatedByUserId, request.getQuestions());
            return ResponseEntity.ok(checklist);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT: Grade an interview question Pass/Fail (Query 53)
    @PutMapping("/questions/{questionId}")
    public ResponseEntity<?> gradeQuestion(
            @PathVariable String questionId,
            @RequestParam String workspaceId,
            @RequestBody GradeQuestionRequest request) {
        try {
            InterviewQuestion gradedQuestion = interviewService.gradeQuestion(workspaceId, questionId, request.getIsPassed());
            return ResponseEntity.ok(gradedQuestion);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET: Retrieve the checklist for review (Query 54)
    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<?> getChecklist(
            @PathVariable String candidateId,
            @RequestParam String workspaceId) {
        try {
            return ResponseEntity.ok(interviewService.getChecklistDetails(workspaceId, candidateId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DTOs
    @Getter
    @Setter
    public static class GenerateQuestionsRequest {
        private List<String> questions;
    }

    @Getter
    @Setter
    public static class GradeQuestionRequest {
        private Boolean isPassed;
    }
}