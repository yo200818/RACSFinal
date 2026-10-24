package com.racsai.backend.repository;

import com.racsai.backend.entity.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, String> {
    Optional<Invitation> findByInviteToken(String inviteToken);
    List<Invitation> findByWorkspace_WorkspaceIdOrderByCreatedAtDesc(String workspaceId);
}