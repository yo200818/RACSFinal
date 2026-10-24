package com.racsai.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_evaluations")
@Getter
@Setter
public class AiEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "evaluation_id", length = 36, updatable = false, nullable = false)
    private String evaluationId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workspace_id", nullable = false, foreignKey = @ForeignKey(name = "fk_aieval_workspace"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Workspace workspace;

    // UNIQUE constraint enforces 1:1 cardinality (A candidate gets exactly one scorecard)
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false, unique = true, foreignKey = @ForeignKey(name = "fk_aieval_candidate"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Candidate candidate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false, foreignKey = @ForeignKey(name = "fk_aieval_job"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private JobPosting jobPosting;

    // Matches the CHECK constraint: match_score_percent >= 0 AND <= 100
    @Min(0)
    @Max(100)
    @Column(name = "match_score_percent", nullable = false)
    private Integer matchScorePercent = 0;

    @Column(name = "evaluation_status", length = 50)
    private String evaluationStatus = "Processing";

    // Maps directly to MySQL's JSON data type to hold the matched/missing skills
    @Column(name = "api_response_json", columnDefinition = "JSON", nullable = false)
    private String apiResponseJson = "{}";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}