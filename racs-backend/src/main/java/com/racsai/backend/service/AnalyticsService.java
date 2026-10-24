package com.racsai.backend.service;

import com.racsai.backend.entity.*;
import com.racsai.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AnalyticsService {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private DataExportHistoryRepository exportHistoryRepository;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private UserRepository userRepository;

    // Query 67: Dashboard Time-To-Hire Metric
    public List<TimeToHireMetric> getTimeToHireMetrics(String workspaceId, LocalDate startDate, LocalDate endDate) {
        // Convert LocalDate to LocalDateTime for precise SQL timestamp comparisons
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(23, 59, 59);
        return candidateRepository.calculateTimeToHire(workspaceId, start, end);
    }

    // Queries 68 & 69: Log Export Request AND Return Data
    @Transactional
    public List<ExportDataRecord> executeDataExport(String workspaceId, String userId, LocalDate startDate, LocalDate endDate, String format) {
        Workspace workspace = workspaceRepository.findById(workspaceId).orElseThrow();
        User adminOrHr = userRepository.findById(userId).orElseThrow();

        if (!adminOrHr.getWorkspace().getWorkspaceId().equals(workspaceId)) {
            throw new IllegalArgumentException("Cross-tenant violation.");
        }

        // Query 68: Log the Export Request
        DataExportHistory log = new DataExportHistory();
        log.setWorkspace(workspace);
        log.setGeneratedBy(adminOrHr);
        log.setReportType("Full Recruitment Pipeline Export");
        log.setFilterStartDate(startDate);
        log.setFilterEndDate(endDate);
        log.setExportFormat(format);
        exportHistoryRepository.save(log);

        // Query 69: Execute and return the stripped dataset (Max 10000 records)
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(23, 59, 59);
        
        return candidateRepository.generateStrippedExportData(workspaceId, start, end);
    }
}