package com.racsai.backend.entity;

import java.time.LocalDateTime;

public interface ExportDataRecord {
    String getCandidateName();
    String getJobTitle();
    String getPipelineStatus();
    Integer getMatchScorePercent();
    LocalDateTime getApplicationDate();
}