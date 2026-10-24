package com.racsai.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "data_export_history")
@Getter
@Setter
public class DataExportHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "export_id", length = 36, updatable = false, nullable = false)
    private String exportId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workspace_id", nullable = false, foreignKey = @ForeignKey(name = "fk_export_workspace"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Workspace workspace;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "generated_by", nullable = false, foreignKey = @ForeignKey(name = "fk_export_user"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User generatedBy;

    @Column(name = "report_type", length = 100, nullable = false)
    private String reportType;

    @Column(name = "filter_start_date", nullable = false)
    private LocalDate filterStartDate;

    @Column(name = "filter_end_date", nullable = false)
    private LocalDate filterEndDate;

    @Column(name = "export_format", length = 20, nullable = false)
    private String exportFormat;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}