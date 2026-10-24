package com.racsai.backend.repository;

import com.racsai.backend.entity.DataExportHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DataExportHistoryRepository extends JpaRepository<DataExportHistory, String> {
}