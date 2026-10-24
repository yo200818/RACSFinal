package com.racsai.backend.service;

import com.racsai.backend.entity.*;
import com.racsai.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ByokService {

    @Autowired
    private TenantApiKeyRepository apiKeyRepository;

    @Autowired
    private ApiUsageLogRepository usageLogRepository;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private UserRepository userRepository;

    // Query 72: Input and Encrypt Client API Key
    @Transactional
    public void configureTenantApiKey(String workspaceId, String userId, String providerName, String rawApiKey) {
        if (!providerName.equals("Gemini") && !providerName.equals("OpenAI")) {
            throw new IllegalArgumentException("Provider must be 'Gemini' or 'OpenAI'.");
        }

        User user = userRepository.findById(userId).orElseThrow();
        if (!user.getWorkspace().getWorkspaceId().equals(workspaceId)) {
            throw new IllegalArgumentException("Cross-tenant violation.");
        }

        String keyId = UUID.randomUUID().toString();
        
        // Execute the native MySQL AES_ENCRYPT query
        apiKeyRepository.upsertEncryptedApiKey(keyId, workspaceId, providerName, rawApiKey, userId);
    }

    // Query 73: Retrieve Decrypted Key for Backend Routing
    public DecryptedKeyRecord getDecryptedKey(String workspaceId) {
        return apiKeyRepository.fetchDecryptedKey(workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("No active API key found for this workspace."));
    }

    // Helper: Log API Usage internally
    public ApiUsageLog logApiUsage(String workspaceId, String providerName, String endpointCalled, String responseStatus) {
        Workspace workspace = workspaceRepository.findById(workspaceId).orElseThrow();
        
        ApiUsageLog log = new ApiUsageLog();
        log.setWorkspace(workspace);
        log.setProviderName(providerName);
        log.setEndpointCalled(endpointCalled);
        log.setResponseStatus(responseStatus);
        
        return usageLogRepository.save(log);
    }

    // Query 74: View API Usage Logs
    public List<ApiUsageLog> getUsageLogs(String workspaceId) {
        return usageLogRepository.findByWorkspace_WorkspaceIdOrderByRequestTimestampDesc(workspaceId);
    }
}