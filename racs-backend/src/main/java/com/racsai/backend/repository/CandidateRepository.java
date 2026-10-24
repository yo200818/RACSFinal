package com.racsai.backend.repository;

import com.racsai.backend.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.racsai.backend.entity.TimeToHireMetric;
import com.racsai.backend.entity.ExportDataRecord;
import java.time.LocalDateTime;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, String> {
    
    // Finds a specific candidate while strictly enforcing tenant isolation
    Optional<Candidate> findByCandidateIdAndWorkspace_WorkspaceId(String candidateId, String workspaceId);

    // Lists all candidates for a specific job posting inside a workspace
    List<Candidate> findByJobPosting_JobIdAndWorkspace_WorkspaceIdOrderByCreatedAtDesc(String jobId, String workspaceId);

    // Query 47: Filter Candidates by Pipeline Status (Dashboard View)
    List<Candidate> findByPipelineStatusAndWorkspace_WorkspaceId(String pipelineStatus, String workspaceId);

    // Query 67: Calculate "Time-to-Hire" Metric (Native SQL)
    @Query(value = """
        SELECT j.job_title AS jobTitle, 
               COUNT(h.candidate_id) AS totalHires, 
               AVG(TIMESTAMPDIFF(DAY, c.created_at, h.changed_at)) AS avgTimeToHireDays
        FROM candidates c
        JOIN candidate_status_history h ON c.candidate_id = h.candidate_id
        JOIN job_postings j ON c.job_id = j.job_id
        WHERE c.workspace_id = :workspaceId
        AND h.new_status = 'Offer Accepted'
        AND h.changed_at BETWEEN :startDate AND :endDate
        GROUP BY j.job_title
        ORDER BY avgTimeToHireDays ASC
        """, nativeQuery = true)
    List<TimeToHireMetric> calculateTimeToHire(
            @Param("workspaceId") String workspaceId, 
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);

    // Query 69: Execute Data Export (Strictly Stripped Data - Limit 10000)
    @Query(value = """
        SELECT c.candidate_name AS candidateName, 
               j.job_title AS jobTitle, 
               c.pipeline_status AS pipelineStatus, 
               e.match_score_percent AS matchScorePercent, 
               c.created_at AS applicationDate
        FROM candidates c
        JOIN job_postings j ON c.job_id = j.job_id
        LEFT JOIN ai_evaluations e ON c.candidate_id = e.candidate_id
        WHERE c.workspace_id = :workspaceId
        AND c.created_at BETWEEN :startDate AND :endDate
        ORDER BY c.created_at DESC
        LIMIT 10000
        """, nativeQuery = true)
    List<ExportDataRecord> generateStrippedExportData(
            @Param("workspaceId") String workspaceId, 
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
}

