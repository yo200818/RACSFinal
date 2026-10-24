package com.racsai.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "invitations")
@Getter
@Setter
public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "invite_id", length = 36, updatable = false, nullable = false)
    private String inviteId;

    // FOREIGN KEY (workspace_id) REFERENCES workspaces(workspace_id)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workspace_id", nullable = false, foreignKey = @ForeignKey(name = "fk_invitations_workspace"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Workspace workspace;

    @Column(name = "invited_role", length = 50, nullable = false)
    private String invitedRole;

    @Column(name = "invite_token", length = 255, nullable = false, unique = true)
    private String inviteToken;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    // FOREIGN KEY (created_by) REFERENCES users(user_id)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by", nullable = false, foreignKey = @ForeignKey(name = "fk_invitations_created_by"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User createdBy;

    @JsonProperty("is_used")
    @Column(name = "is_used", nullable = false)
    private boolean isUsed = false;

    public boolean isUsed() {
        return this.isUsed;
    }

    public void setUsed(boolean isUsed) {
        this.isUsed = isUsed;
    }

    @JsonProperty("isUsed")
    public boolean getIsUsed() {
        return this.isUsed;
    }

    public void setIsUsed(boolean isUsed) {
        this.isUsed = isUsed;
    }

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}