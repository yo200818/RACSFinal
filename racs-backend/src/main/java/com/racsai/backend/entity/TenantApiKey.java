package com.racsai.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tenant_api_keys")
@Getter
@Setter
public class TenantApiKey {

    @Id
    @Column(name = "key_id", length = 36, updatable = false, nullable = false)
    private String keyId;

    // UNIQUE constraint enforces one active key config per workspace
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workspace_id", nullable = false, unique = true, foreignKey = @ForeignKey(name = "fk_apikey_workspace"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Workspace workspace;

    @Column(name = "provider_name", length = 50, nullable = false)
    private String providerName;

    // Maps to VARBINARY in MySQL to hold the AES-encrypted string
    @JsonIgnore
    @Column(name = "encrypted_api_key", columnDefinition = "VARBINARY(255)", nullable = false)
    private byte[] encryptedApiKey;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "configured_by", nullable = false, foreignKey = @ForeignKey(name = "fk_apikey_user"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User configuredBy;

    @Column(name = "is_active")
    private boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}