package com.racsai.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "api_usage_logs")
@Getter
@Setter
public class ApiUsageLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "log_id", length = 36, updatable = false, nullable = false)
    private String logId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workspace_id", nullable = false, foreignKey = @ForeignKey(name = "fk_apilog_workspace"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Workspace workspace;

    @Column(name = "provider_name", length = 50, nullable = false)
    private String providerName;

    @Column(name = "endpoint_called", length = 100, nullable = false)
    private String endpointCalled;

    @CreationTimestamp
    @Column(name = "request_timestamp", updatable = false)
    private LocalDateTime requestTimestamp;

    @Column(name = "response_status", length = 50, nullable = false)
    private String responseStatus;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}