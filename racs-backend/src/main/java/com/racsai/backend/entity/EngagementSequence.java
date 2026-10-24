package com.racsai.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "engagement_sequences")
@Getter
@Setter
public class EngagementSequence {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "sequence_id", length = 36, updatable = false, nullable = false)
    private String sequenceId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workspace_id", nullable = false, foreignKey = @ForeignKey(name = "fk_sequence_workspace"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Workspace workspace;

    @NotBlank(message = "Template text is required.")
    @Column(name = "template_text", columnDefinition = "TEXT", nullable = false)
    private String templateText;

    @NotNull(message = "Sequence timing is required.")
    @Column(name = "sequence_timing_days", nullable = false)
    private Integer sequenceTimingDays;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by", nullable = false, foreignKey = @ForeignKey(name = "fk_sequence_user"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User createdBy;

    // Cascade delete for candidate enrollments tied to this sequence
    @OneToMany(mappedBy = "sequence", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<CandidateEngagement> enrollments = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}