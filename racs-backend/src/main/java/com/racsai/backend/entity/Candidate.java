package com.racsai.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;

import java.time.LocalDateTime;

@Entity
@Table(name = "candidates")
@Getter
@Setter
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "candidate_id", length = 36, updatable = false, nullable = false)
    private String candidateId;

    // FOREIGN KEY (workspace_id)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workspace_id", nullable = false, foreignKey = @ForeignKey(name = "fk_candidates_workspace"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Workspace workspace;

    // FOREIGN KEY (job_id)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false, foreignKey = @ForeignKey(name = "fk_candidates_job"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private JobPosting jobPosting;

    // FOREIGN KEY (uploaded_by) pointing to users
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "uploaded_by", nullable = false, foreignKey = @ForeignKey(name = "fk_candidates_user"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User uploadedBy;

    @Column(name = "candidate_name", length = 150)
    private String candidateName;

    @Column(name = "original_file_url", length = 255, nullable = false)
    private String originalFileUrl;

    @Column(name = "file_type", length = 10, nullable = false)
    private String fileType;

    @Column(name = "file_size_kb", nullable = false)
    private Integer fileSizeKb;

    // LONGTEXT to store massive blocks of extracted resume text without truncating
    @Column(name = "extracted_text", columnDefinition = "LONGTEXT")
    private String extractedText;

    @Column(name = "processing_status", length = 50)
    private String processingStatus = "Pending Parsing";

    // Added from Epic 04 / ER Diagram to track hiring progress
    @Column(name = "pipeline_status", length = 50)
    private String pipelineStatus = "New Applied";

    // ADDED: Cascade delete for the unique AI Scorecard tied to this candidate (1:1 Relationship)
    @OneToOne(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private AiEvaluation aiEvaluation;

    // ADDED: Cascade deletes for the status audit trail tied to this candidate
    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<CandidateStatusHistory> statusHistories = new ArrayList<>();

    // ADDED: Cascade deletes for Interview Checklists tied to this candidate
    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<InterviewChecklist> interviewChecklists = new ArrayList<>();

    // ADDED: Cascade delete for the unique HR Handoff Report tied to this candidate (1:1 Relationship)
    @OneToOne(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private HrHandoffReport hrHandoffReport;

    // ADDED: Cascade deletes for Engagement enrollments tied to this candidate
    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<CandidateEngagement> candidateEngagements = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}