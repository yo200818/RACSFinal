package com.racsai.backend.api;

import com.racsai.backend.entity.*;
import com.racsai.backend.repository.*;
import com.racsai.backend.service.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.repository.Query;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ServiceInvariantTests {
    @Mock JobPostingRepository jobRepository;
    @Mock WorkspaceRepository workspaceRepository;
    @Mock UserRepository userRepository;
    private final JobPostingService jobPostingService = new JobPostingService();

    @Mock CandidateRepository candidateRepository;
    @Mock CandidateStatusHistoryRepository historyRepository;
    private final PipelineService pipelineService = new PipelineService();

    @Mock HrHandoffReportRepository handoffRepository;
    private final HrHandoffService handoffService = new HrHandoffService();

    @Mock CandidateRepository uploadCandidateRepository;
    @Mock WorkspaceRepository uploadWorkspaceRepository;
    @Mock JobPostingRepository uploadJobRepository;
    @Mock UserRepository uploadUserRepository;
    private final CandidateService candidateService = new CandidateService();

    @org.junit.jupiter.api.BeforeEach
    void injectRepositories() {
        ReflectionTestUtils.setField(jobPostingService, "jobPostingRepository", jobRepository);
        ReflectionTestUtils.setField(jobPostingService, "workspaceRepository", workspaceRepository);
        ReflectionTestUtils.setField(jobPostingService, "userRepository", userRepository);

        ReflectionTestUtils.setField(pipelineService, "candidateRepository", candidateRepository);
        ReflectionTestUtils.setField(pipelineService, "historyRepository", historyRepository);
        ReflectionTestUtils.setField(pipelineService, "userRepository", userRepository);
        ReflectionTestUtils.setField(pipelineService, "workspaceRepository", workspaceRepository);

        ReflectionTestUtils.setField(handoffService, "handoffRepository", handoffRepository);

        ReflectionTestUtils.setField(candidateService, "candidateRepository", uploadCandidateRepository);
        ReflectionTestUtils.setField(candidateService, "workspaceRepository", uploadWorkspaceRepository);
        ReflectionTestUtils.setField(candidateService, "jobPostingRepository", uploadJobRepository);
        ReflectionTestUtils.setField(candidateService, "userRepository", uploadUserRepository);
    }

    @Test
    void deletingAJobPersistsDeletedStatusAndDeletedJobsCannotBeEdited() {
        JobPosting job = new JobPosting();
        job.setStatus("Active");
        when(jobRepository.findByJobIdAndWorkspace_WorkspaceId("job-a", "ws-a"))
                .thenReturn(Optional.of(job));
        when(jobRepository.save(any(JobPosting.class))).thenAnswer(invocation -> invocation.getArgument(0));

        jobPostingService.softDeleteJob("ws-a", "job-a");

        assertEquals("Deleted", job.getStatus());
        verify(jobRepository).save(job);

        job.setStatus("Deleted");
        assertThrows(IllegalArgumentException.class,
                () -> jobPostingService.updateJobPosting("ws-a", "job-a", new JobPosting()));
        verify(jobRepository, times(1)).save(job);
    }

    @Test
    void candidateUploadEnforcesFiveMegabyteLimitAndTenantOwnership() {
        Candidate tooLarge = new Candidate();
        tooLarge.setFileType("pdf");
        tooLarge.setFileSizeKb(5121);
        assertThrows(IllegalArgumentException.class,
                () -> candidateService.uploadResume("ws-a", "job-a", "user-a", tooLarge));
        verifyNoInteractions(uploadWorkspaceRepository, uploadJobRepository, uploadUserRepository,
                uploadCandidateRepository);

        Workspace tenantA = new Workspace();
        tenantA.setWorkspaceId("ws-a");
        Workspace tenantB = new Workspace();
        tenantB.setWorkspaceId("ws-b");
        JobPosting foreignJob = new JobPosting();
        foreignJob.setWorkspace(tenantB);
        User uploader = new User();
        uploader.setWorkspace(tenantA);
        when(uploadWorkspaceRepository.findById("ws-a")).thenReturn(Optional.of(tenantA));
        when(uploadJobRepository.findById("job-b")).thenReturn(Optional.of(foreignJob));
        when(uploadUserRepository.findById("user-a")).thenReturn(Optional.of(uploader));

        Candidate resume = new Candidate();
        resume.setFileType("DOCX");
        resume.setFileSizeKb(5120);
        assertThrows(IllegalArgumentException.class,
                () -> candidateService.uploadResume("ws-a", "job-b", "user-a", resume));
        verifyNoInteractions(uploadCandidateRepository);
    }

    @Test
    void pipelineTransitionWritesAuditHistoryAlongsideCandidateStatus() {
        Workspace workspace = new Workspace();
        workspace.setWorkspaceId("ws-a");
        User user = new User();
        user.setWorkspace(workspace);
        Candidate candidate = new Candidate();
        candidate.setPipelineStatus("New Applied");

        when(workspaceRepository.findById("ws-a")).thenReturn(Optional.of(workspace));
        when(userRepository.findById("user-a")).thenReturn(Optional.of(user));
        when(candidateRepository.findByCandidateIdAndWorkspace_WorkspaceId("candidate-a", "ws-a"))
                .thenReturn(Optional.of(candidate));
        when(candidateRepository.save(any(Candidate.class))).thenAnswer(invocation -> invocation.getArgument(0));

        assertSame(candidate, pipelineService.updatePipelineStatus(
                "ws-a", "candidate-a", "user-a", "Interviewing"));

        ArgumentCaptor<CandidateStatusHistory> history = ArgumentCaptor.forClass(CandidateStatusHistory.class);
        verify(historyRepository).save(history.capture());
        assertEquals("New Applied", history.getValue().getOldStatus());
        assertEquals("Interviewing", history.getValue().getNewStatus());
        assertEquals("Interviewing", candidate.getPipelineStatus());
    }

    @Test
    void immutableHandoffNotesAreRejectedWithoutSaving() {
        HrHandoffReport report = new HrHandoffReport();
        report.setImmutable(true);
        when(handoffRepository.findByReportIdAndWorkspace_WorkspaceId("report-a", "ws-a"))
                .thenReturn(Optional.of(report));

        assertThrows(IllegalStateException.class,
                () -> handoffService.attemptToEditNotes("ws-a", "report-a", "edited notes"));
        verify(handoffRepository, never()).save(any(HrHandoffReport.class));
    }

    @Test
    void exportQueryIsTenantScopedStrippedAndCappedAtTenThousandRows() throws Exception {
        Query query = CandidateRepository.class
                .getMethod("generateStrippedExportData", String.class, java.time.LocalDateTime.class,
                        java.time.LocalDateTime.class)
                .getAnnotation(Query.class);

        assertNotNull(query);
        String sql = query.value().toLowerCase();
        assertTrue(sql.contains("where c.workspace_id = :workspaceid"));
        assertTrue(sql.contains("limit 10000"));
        assertFalse(sql.contains("email"));
        assertFalse(sql.contains("phone"));
        assertFalse(sql.contains("resume"));
    }

    @Test
    void byokVerificationUsesNativeMysqlDecryption() throws Exception {
        Query query = TenantApiKeyRepository.class
                .getMethod("fetchDecryptedKey", String.class)
                .getAnnotation(Query.class);

        assertNotNull(query);
        assertTrue(query.nativeQuery());
        assertTrue(query.value().contains("AES_DECRYPT"));
        assertTrue(query.value().contains("workspace_id = :workspaceId"));
    }
}
