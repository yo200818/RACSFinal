package com.racsai.backend.controller;

import com.racsai.backend.entity.ExportDataRecord;
import com.racsai.backend.entity.TimeToHireMetric;
import com.racsai.backend.service.AnalyticsService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    // GET: Dashboard Metrics (Query 67)
    @GetMapping("/time-to-hire")
    public ResponseEntity<List<TimeToHireMetric>> getTimeToHire(
            @RequestParam String workspaceId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        
        return ResponseEntity.ok(analyticsService.getTimeToHireMetrics(workspaceId, start, end));
    }

    // POST: Log Request and Download CSV/Excel JSON representation (Queries 68 & 69)
    @PostMapping("/export")
    public ResponseEntity<?> requestDataExport(
            @RequestParam String workspaceId,
            @RequestParam String userId,
            @RequestBody ExportRequest request) {
        try {
            LocalDate start = LocalDate.parse(request.getStartDate());
            LocalDate end = LocalDate.parse(request.getEndDate());
            
            List<ExportDataRecord> data = analyticsService.executeDataExport(
                    workspaceId, userId, start, end, request.getExportFormat()
            );
            return ResponseEntity.ok(data);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DTO
    @Getter
    @Setter
    public static class ExportRequest {
        private String startDate; // e.g., "2026-09-01"
        private String endDate;   // e.g., "2026-09-30"
        private String exportFormat; // "CSV" or "Excel"
    }
}