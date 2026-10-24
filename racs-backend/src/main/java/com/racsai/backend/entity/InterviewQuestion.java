package com.racsai.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "interview_questions")
@Getter
@Setter
public class InterviewQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "question_id", length = 36, updatable = false, nullable = false)
    private String questionId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "checklist_id", nullable = false, foreignKey = @ForeignKey(name = "fk_question_checklist"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private InterviewChecklist checklist;

    @Column(name = "question_text", columnDefinition = "TEXT", nullable = false)
    private String questionText;

    // Uses Boolean object instead of primitive boolean to allow NULL as a valid default state
    @Column(name = "is_passed")
    private Boolean isPassed = null;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}