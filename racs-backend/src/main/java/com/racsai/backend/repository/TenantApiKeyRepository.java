package com.racsai.backend.repository;

import com.racsai.backend.entity.DecryptedKeyRecord;
import com.racsai.backend.entity.TenantApiKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TenantApiKeyRepository extends JpaRepository<TenantApiKey, String> {

    // Query 72: Input and Encrypt Client API Key using MySQL AES_ENCRYPT and ON DUPLICATE KEY UPDATE
    @Modifying
    @Query(value = """
        INSERT INTO tenant_api_keys (key_id, workspace_id, provider_name, encrypted_api_key, configured_by)
        VALUES (:keyId, :workspaceId, :providerName, AES_ENCRYPT(:rawApiKey, 'SUPER_SECRET_SERVER_MASTER_KEY_STRING'), :userId)
        ON DUPLICATE KEY UPDATE 
        provider_name = :providerName,
        encrypted_api_key = AES_ENCRYPT(:rawApiKey, 'SUPER_SECRET_SERVER_MASTER_KEY_STRING'),
        configured_by = :userId
        """, nativeQuery = true)
    void upsertEncryptedApiKey(
            @Param("keyId") String keyId,
            @Param("workspaceId") String workspaceId,
            @Param("providerName") String providerName,
            @Param("rawApiKey") String rawApiKey,
            @Param("userId") String userId);

    // Query 73: Authenticate and Route Request (Decrypt key securely at the DB level)
    @Query(value = """
        SELECT provider_name AS providerName,
               CAST(AES_DECRYPT(encrypted_api_key, 'SUPER_SECRET_SERVER_MASTER_KEY_STRING') AS CHAR) AS decryptedApiKey
        FROM tenant_api_keys
        WHERE workspace_id = :workspaceId
        AND is_active = TRUE
        """, nativeQuery = true)
    Optional<DecryptedKeyRecord> fetchDecryptedKey(@Param("workspaceId") String workspaceId);
}