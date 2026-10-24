package com.racsai.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "workspaces")
@Getter
@Setter
public class Workspace {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "workspace_id", length = 36, updatable = false, nullable = false)
    private String workspaceId;

    @Column(name = "company_name", length = 150, nullable = false)
    private String companyName;

    @Column(name = "company_address", columnDefinition = "TEXT", nullable = false)
    private String companyAddress;

    @Column(name = "gstin", length = 50, nullable = false, unique = true)
    private String gstin;

    @Column(name = "company_phone", length = 20, nullable = false)
    private String companyPhone;

    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<User> users = new ArrayList<>();

    // ADDED: Cascade deletes for Job Postings tied to this workspace
    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<JobPosting> jobPostings = new ArrayList<>();

    // ADDED: Cascade deletes for Candidates tied to this workspace
    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Candidate> candidates = new ArrayList<>();

    // ADDED: Cascade deletes for AI Evaluations tied to this workspace
    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<AiEvaluation> aiEvaluations = new ArrayList<>();

    // ADDED: Cascade deletes for Candidate Status History audit logs tied to this workspace
    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<CandidateStatusHistory> statusHistories = new ArrayList<>();

    // ADDED: Cascade deletes for Interview Checklists tied to this workspace
    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<InterviewChecklist> interviewChecklists = new ArrayList<>();

    // ADDED: Cascade deletes for HR Handoff Reports tied to this workspace
    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<HrHandoffReport> hrHandoffReports = new ArrayList<>();

    // ADDED: Cascade deletes for Engagement Sequences tied to this workspace
    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<EngagementSequence> engagementSequences = new ArrayList<>();

    // ADDED: Cascade deletes for Candidate Engagements (Enrollments) tied to this workspace
    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<CandidateEngagement> candidateEngagements = new ArrayList<>();

    // ADDED: Cascade deletes for Data Export History logs tied to this workspace
    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<DataExportHistory> dataExportHistories = new ArrayList<>();

    // ADDED: Cascade delete for the unique API Key configuration tied to this workspace (1:1 Relationship)
    @OneToOne(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private TenantApiKey tenantApiKey;

    // ADDED: Cascade deletes for API Usage Logs tied to this workspace
    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ApiUsageLog> apiUsageLogs = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}