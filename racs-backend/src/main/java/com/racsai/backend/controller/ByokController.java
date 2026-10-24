package com.racsai.backend.controller;

import com.racsai.backend.entity.ApiUsageLog;
import com.racsai.backend.entity.DecryptedKeyRecord;
import com.racsai.backend.service.ByokService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/byok")
public class ByokController {

    @Autowired
    private ByokService byokService;

    // POST: Save encrypted API key (Query 72)
    @PostMapping("/configure")
    public ResponseEntity<?> configureKey(
            @RequestParam String workspaceId,
            @RequestParam String userId,
            @RequestBody ConfigureKeyRequest request) {
        try {
            byokService.configureTenantApiKey(workspaceId, userId, request.getProviderName(), request.getRawApiKey());
            return ResponseEntity.ok(Map.of("message", "API Key securely encrypted and saved."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET: Internal check to verify decryption works (Query 73)
    @GetMapping("/verify-key")
    public ResponseEntity<?> verifyDecryption(@RequestParam String workspaceId) {
        try {
            DecryptedKeyRecord record = byokService.getDecryptedKey(workspaceId);
            return ResponseEntity.ok(Map.of(
                    "provider", record.getProviderName(),
                    "decryptedKey", record.getDecryptedApiKey()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // POST: Internal hook to log an API call 
    @PostMapping("/log")
    public ResponseEntity<ApiUsageLog> logUsage(
            @RequestParam String workspaceId,
            @RequestBody UsageLogRequest request) {
        return ResponseEntity.ok(byokService.logApiUsage(
                workspaceId, request.getProviderName(), request.getEndpointCalled(), request.getResponseStatus()
        ));
    }

    // GET: Admin dashboard for usage logs (Query 74)
    @GetMapping("/logs")
    public ResponseEntity<List<ApiUsageLog>> getLogs(@RequestParam String workspaceId) {
        return ResponseEntity.ok(byokService.getUsageLogs(workspaceId));
    }

    // DTOs
    @Getter
    @Setter
    public static class ConfigureKeyRequest {
        private String providerName;
        private String rawApiKey;
    }

    @Getter
    @Setter
    public static class UsageLogRequest {
        private String providerName;
        private String endpointCalled;
        private String responseStatus;
    }
}