package com.racsai.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "hr_handoff_reports")
@Getter
@Setter
public class HrHandoffReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "report_id", length = 36, updatable = false, nullable = false)
    private String reportId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workspace_id", nullable = false, foreignKey = @ForeignKey(name = "fk_handoff_workspace"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Workspace workspace;

    // UNIQUE constraint ensures one final report per candidate (1:1 relationship)
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false, unique = true, foreignKey = @ForeignKey(name = "fk_handoff_candidate"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Candidate candidate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false, foreignKey = @ForeignKey(name = "fk_handoff_job"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private JobPosting jobPosting;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hiring_manager_id", nullable = false, foreignKey = @ForeignKey(name = "fk_handoff_manager"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User hiringManager;

    @NotBlank(message = "Final notes cannot be empty.")
    @Column(name = "final_hm_notes", columnDefinition = "TEXT", nullable = false)
    private String finalHmNotes;

    @Column(name = "report_status", length = 50)
    private String reportStatus = "Pending HR Review";

    // Enforces the strict compliance rule that notes cannot be edited after submission
    @Column(name = "is_immutable", nullable = false)
    private boolean isImmutable = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}