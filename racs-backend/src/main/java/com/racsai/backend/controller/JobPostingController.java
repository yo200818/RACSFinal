package com.racsai.backend.controller;

import jakarta.validation.Valid;

import com.racsai.backend.entity.JobPosting;
import com.racsai.backend.service.JobPostingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobPostingController {

    @Autowired
    private JobPostingService jobPostingService;

    // POST: Create a new job posting (Queries 23 & 24)
    @PostMapping
    public ResponseEntity<?> createJob(
            @RequestParam String workspaceId,
            @RequestParam String createdByUserId,
            @Valid @RequestBody JobPosting request) {
        try {
            JobPosting newJob = jobPostingService.createJobPosting(workspaceId, createdByUserId, request);
            return ResponseEntity.ok(newJob);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET: View all active job postings for a workspace (Query 25)
    @GetMapping("/workspace/{workspaceId}")
    public ResponseEntity<List<JobPosting>> getActiveJobs(@PathVariable String workspaceId) {
        return ResponseEntity.ok(jobPostingService.getActiveJobsByWorkspace(workspaceId));
    }

    // GET: View specific job details (Query 26)
    @GetMapping("/{jobId}")
    public ResponseEntity<?> getJobDetails(
            @PathVariable String jobId,
            @RequestParam String workspaceId) {
        try {
            return ResponseEntity.ok(jobPostingService.getJobDetails(workspaceId, jobId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT: Edit a job posting (Query 27)
    @PutMapping("/{jobId}")
    public ResponseEntity<?> updateJob(
            @PathVariable String jobId,
            @RequestParam String workspaceId,
            @Valid @RequestBody JobPosting request) {
        try {
            JobPosting updatedJob = jobPostingService.updateJobPosting(workspaceId, jobId, request);
            return ResponseEntity.ok(updatedJob);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE: Soft delete a job posting (Query 28)
    @DeleteMapping("/{jobId}")
    public ResponseEntity<?> deleteJob(
            @PathVariable String jobId,
            @RequestParam String workspaceId) {
        try {
            jobPostingService.softDeleteJob(workspaceId, jobId);
            return ResponseEntity.ok(Map.of("message", "Job posting successfully removed from active dashboard."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}