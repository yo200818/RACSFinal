package com.racsai.backend.repository;

import com.racsai.backend.entity.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, String> {
    
    // Query 25: View All Active Job Postings (filtered by workspace, ordered by newest)
    List<JobPosting> findByWorkspace_WorkspaceIdAndStatusOrderByCreatedAtDesc(String workspaceId, String status);

    // Queries 26, 27, 28: Enforces strict tenant isolation by requiring both Job ID and Workspace ID
    Optional<JobPosting> findByJobIdAndWorkspace_WorkspaceId(String jobId, String workspaceId);
}