package com.racsai.backend.repository;

import com.racsai.backend.entity.ApiUsageLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApiUsageLogRepository extends JpaRepository<ApiUsageLog, String> {
    
    // Query 74: View API Usage Logs
    List<ApiUsageLog> findByWorkspace_WorkspaceIdOrderByRequestTimestampDesc(String workspaceId);
}