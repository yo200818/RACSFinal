package com.racsai.backend.entity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

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
@Table(name = "job_postings")
@Getter
@Setter
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "job_id", length = 36, updatable = false, nullable = false)
    private String jobId;

    // FOREIGN KEY (workspace_id) REFERENCES workspaces(workspace_id)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workspace_id", nullable = false, foreignKey = @ForeignKey(name = "fk_job_postings_workspace"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Workspace workspace;

    // FOREIGN KEY (created_by) REFERENCES users(user_id)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by", nullable = false, foreignKey = @ForeignKey(name = "fk_job_postings_created_by"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User createdBy;

    @NotBlank(message = "Job title is mandatory")
    @Column(name = "job_title", length = 150, nullable = false)
    private String jobTitle;

    @NotBlank(message = "Department is mandatory")
    @Column(name = "department", length = 100, nullable = false)
    private String department;

    @NotNull(message = "Minimum experience is mandatory")
    @Column(name = "min_experience_years", nullable = false)
    private Integer minExperienceYears;

    @NotBlank(message = "Required skills are mandatory")
    @Column(name = "required_skills", columnDefinition = "TEXT", nullable = false)
    private String requiredSkills;

    @NotBlank(message = "Full description is mandatory")
    @Column(name = "full_description", columnDefinition = "TEXT", nullable = false)
    private String fullDescription;

    @NotBlank(message = "Employment type is mandatory")
    @Column(name = "employment_type", length = 50, nullable = false)
    private String employmentType;

    // Matches the default 'Active' state and 'Deleted' state from Queries 22 & 28
    @Column(name = "status", length = 20, nullable = false)
    private String status = "Active";

    // ADDED: Cascade deletes for Candidates applied to this specific job
    @OneToMany(mappedBy = "jobPosting", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Candidate> candidates = new ArrayList<>();

    // ADDED: Cascade deletes for AI Evaluations tied to this specific job
    @OneToMany(mappedBy = "jobPosting", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<AiEvaluation> aiEvaluations = new ArrayList<>();

    // ADDED: Cascade deletes for Interview Checklists tied to this job
    @OneToMany(mappedBy = "jobPosting", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<InterviewChecklist> interviewChecklists = new ArrayList<>();

    // ADDED: Cascade deletes for HR Handoff Reports tied to this job
    @OneToMany(mappedBy = "jobPosting", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<HrHandoffReport> hrHandoffReports = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}