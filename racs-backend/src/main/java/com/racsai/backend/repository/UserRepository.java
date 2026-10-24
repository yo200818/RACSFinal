package com.racsai.backend.repository;

import com.racsai.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    // Used for Query 3 validation (Duplicate Email check)
    boolean existsByEmail(String email);

    // Used for Query 6 (Verify Workspace & Admin Role by Email)
    Optional<User> findByEmail(String email);

    // Used for Query 12 (View Team Directory ordered by created_at DESC)
    List<User> findByWorkspace_WorkspaceIdOrderByCreatedAtDesc(String workspaceId);
}