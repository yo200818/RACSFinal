package com.racsai.backend.repository;

import com.racsai.backend.entity.HrHandoffReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HrHandoffReportRepository extends JpaRepository<HrHandoffReport, String> {
    
    // Finds the specific report by its ID
    Optional<HrHandoffReport> findByReportIdAndWorkspace_WorkspaceId(String reportId, String workspaceId);

    // Finds the report linked to a specific candidate for the Unified Summary compilation
    Optional<HrHandoffReport> findByCandidate_CandidateIdAndWorkspace_WorkspaceId(String candidateId, String workspaceId);
}