package com.racsai.backend.api;

import com.racsai.backend.controller.*;
import com.racsai.backend.entity.*;
import com.racsai.backend.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class EpicApiContractTests {
    private MockMvc mvc;

    @Mock WorkspaceService workspaceService;
    @Mock InvitationService invitationService;
    @Mock UserService userService;
    @Mock AuthService authService;
    @Mock JobPostingService jobPostingService;
    @Mock CandidateService candidateService;
    @Mock AiEvaluationService aiEvaluationService;
    @Mock PipelineService pipelineService;
    @Mock InterviewService interviewService;
    @Mock HrHandoffService handoffService;
    @Mock EngagementService engagementService;
    @Mock AnalyticsService analyticsService;
    @Mock ByokService byokService;

    @InjectMocks WorkspaceController workspaceController;
    @InjectMocks InvitationController invitationController;
    @InjectMocks UserController userController;
    @InjectMocks AuthController authController;
    @InjectMocks JobPostingController jobPostingController;
    @InjectMocks CandidateController candidateController;
    @InjectMocks AiEvaluationController aiEvaluationController;
    @InjectMocks PipelineController pipelineController;
    @InjectMocks InterviewController interviewController;
    @InjectMocks HrHandoffController handoffController;
    @InjectMocks EngagementController engagementController;
    @InjectMocks AnalyticsController analyticsController;
    @InjectMocks ByokController byokController;

    @BeforeEach
    void setUp() {
        mvc = MockMvcBuilders.standaloneSetup(
                workspaceController, invitationController, userController, authController,
                jobPostingController, candidateController, aiEvaluationController, pipelineController,
                interviewController, handoffController, engagementController, analyticsController,
                byokController
        ).build();
    }

    private ResultActions post(String path, String body) throws Exception {
        return mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post(path)
                .contentType("application/json").content(body));
    }

    private ResultActions put(String path, String body) throws Exception {
        return mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put(path)
                .contentType("application/json").content(body));
    }

    @Nested
    class Epic01WorkspaceAndAccess {
        @Test
        void workspaceRegistrationValidatesRequiredFieldsAndCreatesAdmin() throws Exception {
            when(workspaceService.createWorkspaceAndAdmin(any(), any(), any(), any(), any(), any(), any()))
                    .thenReturn(Map.of("workspaceId", "ws-a", "role", "System Administrator"));
            post("/api/workspaces/signup", """
                    {"companyName":"Acme","companyAddress":"1 Main St","gstin":"GST-1",
                     "companyPhone":"5550100","adminFullName":"Admin","adminEmail":"admin@acme.test",
                     "adminPassword":"Strong-password-123"}
                    """).andExpect(status().isOk()).andExpect(jsonPath("$.role").value("System Administrator"));

            when(workspaceService.createWorkspaceAndAdmin(any(), any(), any(), any(), any(), any(), any()))
                    .thenThrow(new IllegalArgumentException("All corporate and administrator fields are mandatory."));
            post("/api/workspaces/signup", "{}").andExpect(status().isBadRequest());
        }

        @Test
        void invitationCanBeGeneratedValidatedAndUsedForSignup() throws Exception {
            Workspace workspace = new Workspace();
            workspace.setWorkspaceId("ws-a");
            workspace.setCompanyName("Acme");
            User admin = new User();
            admin.setUserId("admin-a");
            Invitation invite = new Invitation();
            invite.setInviteId("invite-a");
            invite.setWorkspace(workspace);
            invite.setCreatedBy(admin);
            invite.setInvitedRole("Hiring Manager (HM)");
            invite.setInviteToken("secure-token");
            invite.setExpiresAt(LocalDateTime.now().plusHours(48));
            when(invitationService.generateInviteLink("ws-a", "admin-a", "Hiring Manager (HM)")).thenReturn(invite);
            post("/api/invitations/generate", """
                    {"workspaceId":"ws-a","createdByUserId":"admin-a","invitedRole":"Hiring Manager (HM)"}
                    """).andExpect(status().isOk()).andExpect(jsonPath("$.inviteToken").value("secure-token"));

            when(invitationService.validateInviteTokenDetails("secure-token"))
                    .thenReturn(Map.of("workspaceId", "ws-a", "isUsed", false));
            mvc.perform(get("/api/invitations/validate/secure-token"))
                    .andExpect(status().isOk()).andExpect(jsonPath("$.isUsed").value(false));

            when(invitationService.validateInviteTokenDetails("foreign-or-expired"))
                    .thenThrow(new IllegalArgumentException("Invalid invitation link."));
            mvc.perform(get("/api/invitations/validate/foreign-or-expired")).andExpect(status().isBadRequest());

            when(userService.signUpWithInvite(eq("secure-token"), any(), any(), any())).thenReturn(new User());
            post("/api/users/signup/secure-token",
                    "{\"fullName\":\"Taylor Recruiter\",\"email\":\"ta@acme.test\",\"password\":\"Pass1234!\"}")
                    .andExpect(status().isOk());
            when(userService.signUpWithInvite(eq("foreign-token"), any(), any(), any()))
                    .thenThrow(new IllegalArgumentException("Invalid invitation link."));
            post("/api/users/signup/foreign-token", "{}").andExpect(status().isBadRequest());
        }

        @Test
        void loginLogoutAndPasswordResetRejectInvalidCredentialsOrTokens() throws Exception {
            when(authService.login("admin@acme.test", "Pass1234!", true))
                    .thenReturn(Map.of("sessionToken", "session-a", "workspaceId", "ws-a"));
            post("/api/auth/login",
                    "{\"email\":\"admin@acme.test\",\"password\":\"Pass1234!\",\"rememberMe\":true}")
                    .andExpect(status().isOk()).andExpect(jsonPath("$.sessionToken").value("session-a"));
            when(authService.login(any(), any(), anyBoolean())).thenThrow(new IllegalArgumentException("Invalid credentials."));
            post("/api/auth/login", "{\"email\":\"admin@acme.test\",\"password\":\"wrong\"}")
                    .andExpect(status().isBadRequest());

            doNothing().when(authService).logout("session-a");
            mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/api/auth/logout").param("sessionToken", "session-a"))
                    .andExpect(status().isOk());
            doThrow(new IllegalArgumentException("Invalid session.")).when(authService).logout("foreign-session");
            mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/api/auth/logout").param("sessionToken", "foreign-session"))
                    .andExpect(status().isBadRequest());

            PasswordReset reset = new PasswordReset();
            reset.setResetToken("reset-a");
            reset.setExpiresAt(LocalDateTime.now().plusHours(1));
            when(authService.requestPasswordReset("admin@acme.test")).thenReturn(reset);
            post("/api/auth/password-reset/request", "{\"email\":\"admin@acme.test\"}")
                    .andExpect(status().isOk()).andExpect(jsonPath("$.resetToken").value("reset-a"));
            when(authService.requestPasswordReset("missing@acme.test"))
                    .thenThrow(new IllegalArgumentException("No active account found."));
            post("/api/auth/password-reset/request", "{\"email\":\"missing@acme.test\"}")
                    .andExpect(status().isBadRequest());

            doNothing().when(authService).validateResetToken("reset-a");
            mvc.perform(get("/api/auth/password-reset/validate/reset-a")).andExpect(status().isOk());
            doThrow(new IllegalArgumentException("Expired reset token.")).when(authService).validateResetToken("expired");
            mvc.perform(get("/api/auth/password-reset/validate/expired")).andExpect(status().isBadRequest());

            doNothing().when(authService).executePasswordReset("reset-a", "New-pass-123");
            post("/api/auth/password-reset/execute/reset-a", "{\"newPassword\":\"New-pass-123\"}")
                    .andExpect(status().isOk());
            doThrow(new IllegalArgumentException("Expired reset token."))
                    .when(authService).executePasswordReset("expired", "New-pass-123");
            post("/api/auth/password-reset/execute/expired", "{\"newPassword\":\"New-pass-123\"}")
                    .andExpect(status().isBadRequest());
        }

        @Test
        void adminVerificationDirectoryAndAccessRevocationAreTenantScoped() throws Exception {
            when(userService.verifyAdminByEmail("admin@acme.test")).thenReturn(Map.of("workspaceId", "ws-a"));
            mvc.perform(get("/api/users/verify").param("email", "admin@acme.test")).andExpect(status().isOk());
            when(userService.verifyAdminByEmail("foreign@acme.test"))
                    .thenThrow(new IllegalArgumentException("No user found."));
            mvc.perform(get("/api/users/verify").param("email", "foreign@acme.test"))
                    .andExpect(status().isBadRequest());

            when(userService.getTeamDirectory("ws-a")).thenReturn(List.of());
            mvc.perform(get("/api/users/directory/ws-a")).andExpect(status().isOk());
            when(userService.getTeamDirectory("ws-b")).thenReturn(List.of());
            mvc.perform(get("/api/users/directory/ws-b")).andExpect(status().isOk()).andExpect(content().json("[]"));
            when(userService.revokeUserAccess("ws-a", "user-a")).thenReturn(new User());
            mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/users/user-a/revoke").param("workspaceId", "ws-a"))
                    .andExpect(status().isOk());
            when(userService.revokeUserAccess("ws-a", "foreign-user"))
                    .thenThrow(new IllegalArgumentException("User does not belong to this workspace."));
            mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/users/foreign-user/revoke").param("workspaceId", "ws-a"))
                    .andExpect(status().isBadRequest());
        }

        @Test
        void workspaceAndInvitationAdministrationRoutesRespondCorrectly() throws Exception {
            when(workspaceService.verifyWorkspaceAndAdminByEmail("admin@acme.test"))
                    .thenReturn(Map.of("workspaceId", "ws-a"));
            mvc.perform(get("/api/workspaces/verify").param("email", "admin@acme.test"))
                    .andExpect(status().isOk());
            when(workspaceService.verifyWorkspaceAndAdminByEmail("unknown@acme.test"))
                    .thenThrow(new IllegalArgumentException("No workspace found."));
            mvc.perform(get("/api/workspaces/verify").param("email", "unknown@acme.test"))
                    .andExpect(status().isBadRequest());

            when(workspaceService.getAllWorkspaces()).thenReturn(List.of(new Workspace()));
            mvc.perform(get("/api/workspaces")).andExpect(status().isOk());
            when(workspaceService.getWorkspaceById("ws-a")).thenReturn(new Workspace());
            mvc.perform(get("/api/workspaces/ws-a")).andExpect(status().isOk());
            when(workspaceService.getWorkspaceById("missing"))
                    .thenThrow(new IllegalArgumentException("Workspace not found."));
            mvc.perform(get("/api/workspaces/missing")).andExpect(status().isNotFound());

            when(workspaceService.updateWorkspace(eq("ws-a"), any())).thenReturn(new Workspace());
            put("/api/workspaces/ws-a", "{\"companyName\":\"Acme Updated\"}").andExpect(status().isOk());
            when(workspaceService.updateWorkspace(eq("missing"), any()))
                    .thenThrow(new IllegalArgumentException("Workspace not found."));
            put("/api/workspaces/missing", "{}").andExpect(status().isBadRequest());
            doNothing().when(workspaceService).deleteWorkspace("ws-a");
            mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete("/api/workspaces/ws-a"))
                    .andExpect(status().isOk());
            doThrow(new IllegalArgumentException("Workspace not found.")).when(workspaceService).deleteWorkspace("missing");
            mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete("/api/workspaces/missing"))
                    .andExpect(status().isBadRequest());

            when(invitationService.getAllInvitations()).thenReturn(List.of());
            mvc.perform(get("/api/invitations")).andExpect(status().isOk());
        }
    }

    @Nested
    class Epic02JobsAndCandidates {
        @Test
        void jobCrudRequiresWorkspaceOwnershipAndDeleteIsSoft() throws Exception {
            when(jobPostingService.createJobPosting(eq("ws-a"), eq("user-a"), any())).thenReturn(new JobPosting());
            post("/api/jobs?workspaceId=ws-a&createdByUserId=user-a",
                    "{\"jobTitle\":\"Engineer\",\"department\":\"Engineering\",\"minExperienceYears\":2," +
                            "\"requiredSkills\":\"Java\",\"fullDescription\":\"Role\",\"employmentType\":\"Full-time\"}")
                    .andExpect(status().isOk());
            when(jobPostingService.createJobPosting(eq("ws-a"), eq("foreign-user"), any()))
                    .thenThrow(new IllegalArgumentException("User does not belong to this workspace."));
            post("/api/jobs?workspaceId=ws-a&createdByUserId=foreign-user",
                    "{\"jobTitle\":\"Engineer\",\"department\":\"Engineering\",\"minExperienceYears\":2," +
                            "\"requiredSkills\":\"Java\",\"fullDescription\":\"Role\",\"employmentType\":\"Full-time\"}")
                    .andExpect(status().isBadRequest());

            when(jobPostingService.getActiveJobsByWorkspace("ws-a")).thenReturn(List.of(new JobPosting()));
            mvc.perform(get("/api/jobs/workspace/ws-a")).andExpect(status().isOk());
            when(jobPostingService.getActiveJobsByWorkspace("ws-b")).thenReturn(List.of());
            mvc.perform(get("/api/jobs/workspace/ws-b")).andExpect(status().isOk()).andExpect(content().json("[]"));
            when(jobPostingService.getJobDetails("ws-a", "job-a")).thenReturn(new JobPosting());
            mvc.perform(get("/api/jobs/job-a").param("workspaceId", "ws-a")).andExpect(status().isOk());
            when(jobPostingService.getJobDetails("ws-a", "foreign-job"))
                    .thenThrow(new IllegalArgumentException("Job not found or access denied."));
            mvc.perform(get("/api/jobs/foreign-job").param("workspaceId", "ws-a"))
                    .andExpect(status().isBadRequest());

            when(jobPostingService.updateJobPosting(eq("ws-a"), eq("job-a"), any())).thenReturn(new JobPosting());
            put("/api/jobs/job-a?workspaceId=ws-a",
                    "{\"jobTitle\":\"Updated\",\"department\":\"Engineering\",\"minExperienceYears\":2," +
                            "\"requiredSkills\":\"Java\",\"fullDescription\":\"Role\",\"employmentType\":\"Full-time\"}")
                    .andExpect(status().isOk());
            when(jobPostingService.updateJobPosting(eq("ws-a"), eq("foreign-job"), any()))
                    .thenThrow(new IllegalArgumentException("Job not found or access denied."));
            put("/api/jobs/foreign-job?workspaceId=ws-a",
                    "{\"jobTitle\":\"Updated\",\"department\":\"Engineering\",\"minExperienceYears\":2," +
                            "\"requiredSkills\":\"Java\",\"fullDescription\":\"Role\",\"employmentType\":\"Full-time\"}")
                    .andExpect(status().isBadRequest());

            doNothing().when(jobPostingService).softDeleteJob("ws-a", "job-a");
            mvc.perform(delete("/api/jobs/job-a").param("workspaceId", "ws-a")).andExpect(status().isOk());
            doThrow(new IllegalArgumentException("Job not found or access denied."))
                    .when(jobPostingService).softDeleteJob("ws-a", "foreign-job");
            mvc.perform(delete("/api/jobs/foreign-job").param("workspaceId", "ws-a"))
                    .andExpect(status().isBadRequest());
        }

        @Test
        void resumeUploadParseReadAndDeleteEnforceTenantAndFileConstraints() throws Exception {
            when(candidateService.uploadResume(eq("ws-a"), eq("job-a"), eq("user-a"), any()))
                    .thenReturn(new Candidate());
            post("/api/candidates?workspaceId=ws-a&jobId=job-a&uploadedByUserId=user-a",
                    "{\"candidateName\":\"Alex Applicant\",\"fileType\":\"pdf\",\"fileSizeKb\":5000}")
                    .andExpect(status().isOk());
            when(candidateService.uploadResume(eq("ws-a"), anyString(), anyString(), any()))
                    .thenThrow(new IllegalArgumentException("Invalid file format or cross-tenant reference."));
            post("/api/candidates?workspaceId=ws-a&jobId=foreign-job&uploadedByUserId=user-a",
                    "{\"candidateName\":\"Alex Applicant\",\"fileType\":\"exe\",\"fileSizeKb\":1}")
                    .andExpect(status().isBadRequest());

            when(candidateService.updateParsedText("ws-a", "candidate-a", "parsed resume"))
                    .thenReturn(new Candidate());
            put("/api/candidates/candidate-a/parse?workspaceId=ws-a", "{\"extractedText\":\"parsed resume\"}")
                    .andExpect(status().isOk());
            when(candidateService.updateParsedText("ws-a", "foreign-candidate", "text"))
                    .thenThrow(new IllegalArgumentException("Candidate not found in this workspace."));
            put("/api/candidates/foreign-candidate/parse?workspaceId=ws-a", "{\"extractedText\":\"text\"}")
                    .andExpect(status().isBadRequest());

            when(candidateService.getCandidateDetails("ws-a", "candidate-a")).thenReturn(new Candidate());
            mvc.perform(get("/api/candidates/candidate-a").param("workspaceId", "ws-a"))
                    .andExpect(status().isOk());
            when(candidateService.getCandidateDetails("ws-a", "foreign-candidate"))
                    .thenThrow(new IllegalArgumentException("Candidate not found in this workspace."));
            mvc.perform(get("/api/candidates/foreign-candidate").param("workspaceId", "ws-a"))
                    .andExpect(status().isBadRequest());
            when(candidateService.getCandidatesForJob("ws-a", "job-a")).thenReturn(List.of());
            mvc.perform(get("/api/candidates/job/job-a").param("workspaceId", "ws-a"))
                    .andExpect(status().isOk());
            when(candidateService.getCandidatesForJob("ws-b", "job-a")).thenReturn(List.of());
            mvc.perform(get("/api/candidates/job/job-a").param("workspaceId", "ws-b"))
                    .andExpect(status().isOk()).andExpect(content().json("[]"));
            doNothing().when(candidateService).deleteCandidate("ws-a", "candidate-a");
            mvc.perform(delete("/api/candidates/candidate-a").param("workspaceId", "ws-a"))
                    .andExpect(status().isOk());
            doThrow(new IllegalArgumentException("Candidate not found in this workspace."))
                    .when(candidateService).deleteCandidate("ws-a", "foreign-candidate");
            mvc.perform(delete("/api/candidates/foreign-candidate").param("workspaceId", "ws-a"))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    class Epic03AiEvaluation {
        @Test
        void scorecardLifecycleIsWorkspaceScopedAndHasNoManualScoreRoute() throws Exception {
            when(aiEvaluationService.initializeEvaluation("ws-a", "candidate-a", "job-a"))
                    .thenReturn(new AiEvaluation());
            mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/api/evaluations/initialize")
                    .param("workspaceId", "ws-a").param("candidateId", "candidate-a").param("jobId", "job-a"))
                    .andExpect(status().isOk());
            when(aiEvaluationService.initializeEvaluation("ws-a", "foreign-candidate", "job-a"))
                    .thenThrow(new IllegalArgumentException("Candidate not found."));
            mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/api/evaluations/initialize")
                    .param("workspaceId", "ws-a").param("candidateId", "foreign-candidate").param("jobId", "job-a"))
                    .andExpect(status().isBadRequest());

            when(aiEvaluationService.getPromptPayload("ws-a", "candidate-a"))
                    .thenReturn(Map.of("requiredSkills", "Java"));
            mvc.perform(get("/api/evaluations/prompt-payload/candidate-a").param("workspaceId", "ws-a"))
                    .andExpect(status().isOk());
            when(aiEvaluationService.getPromptPayload("ws-a", "foreign-candidate"))
                    .thenThrow(new IllegalArgumentException("Candidate not found."));
            mvc.perform(get("/api/evaluations/prompt-payload/foreign-candidate").param("workspaceId", "ws-a"))
                    .andExpect(status().isBadRequest());

            when(aiEvaluationService.saveEvaluationResult("ws-a", "candidate-a", 88, "{\"skills\":[]}"))
                    .thenReturn(new AiEvaluation());
            put("/api/evaluations/save-result/candidate-a?workspaceId=ws-a",
                    "{\"matchScorePercent\":88,\"apiResponseJson\":\"{\\\"skills\\\":[]}\"}")
                    .andExpect(status().isOk());
            when(aiEvaluationService.saveEvaluationResult(eq("ws-a"), eq("foreign-candidate"), anyInt(), anyString()))
                    .thenThrow(new IllegalArgumentException("Evaluation record not found."));
            put("/api/evaluations/save-result/foreign-candidate?workspaceId=ws-a",
                    "{\"matchScorePercent\":88,\"apiResponseJson\":\"{}\"}").andExpect(status().isBadRequest());

            when(aiEvaluationService.getCandidateScorecard("ws-a", "candidate-a")).thenReturn(new AiEvaluation());
            mvc.perform(get("/api/evaluations/scorecard/candidate-a").param("workspaceId", "ws-a"))
                    .andExpect(status().isOk());
            when(aiEvaluationService.getCandidateScorecard("ws-a", "foreign-candidate"))
                    .thenThrow(new IllegalArgumentException("Scorecard not found."));
            mvc.perform(get("/api/evaluations/scorecard/foreign-candidate").param("workspaceId", "ws-a"))
                    .andExpect(status().isBadRequest());
            when(aiEvaluationService.getJobScorecards("ws-a", "job-a")).thenReturn(List.of());
            mvc.perform(get("/api/evaluations/job-batch/job-a").param("workspaceId", "ws-a"))
                    .andExpect(status().isOk());
            when(aiEvaluationService.getJobScorecards("ws-b", "job-a")).thenReturn(List.of());
            mvc.perform(get("/api/evaluations/job-batch/job-a").param("workspaceId", "ws-b"))
                    .andExpect(status().isOk()).andExpect(content().json("[]"));

            mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/evaluations/scorecard/candidate-a?workspaceId=ws-a")
                    .contentType("application/json").content("{\"matchScorePercent\":100}"))
                    .andExpect(status().isMethodNotAllowed());
        }

        @Test
        void aiTimeoutCanBeFlagged() throws Exception {
            doNothing().when(aiEvaluationService).markEvaluationAsFailed("ws-a", "candidate-a");
            mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/evaluations/timeout/candidate-a").param("workspaceId", "ws-a"))
                    .andExpect(status().isOk());
            doThrow(new IllegalArgumentException("Evaluation not found."))
                    .when(aiEvaluationService).markEvaluationAsFailed("ws-a", "foreign-candidate");
            mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/evaluations/timeout/foreign-candidate").param("workspaceId", "ws-a"))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    class Epic04PipelineAndHandoff {
        @Test
        void pipelineTransitionAndAuditTrailAreTenantScoped() throws Exception {
            when(pipelineService.updatePipelineStatus("ws-a", "candidate-a", "user-a", "Interviewing"))
                    .thenReturn(new Candidate());
            put("/api/pipeline/candidate-a/status?workspaceId=ws-a&userId=user-a",
                    "{\"newStatus\":\"Interviewing\"}").andExpect(status().isOk());
            when(pipelineService.updatePipelineStatus("ws-a", "foreign-candidate", "user-a", "Interviewing"))
                    .thenThrow(new IllegalArgumentException("Candidate not found."));
            put("/api/pipeline/foreign-candidate/status?workspaceId=ws-a&userId=user-a",
                    "{\"newStatus\":\"Interviewing\"}").andExpect(status().isBadRequest());
            when(pipelineService.getCandidatesByStatus("ws-a", "Interviewing")).thenReturn(List.of());
            mvc.perform(get("/api/pipeline/filter").param("workspaceId", "ws-a").param("status", "Interviewing"))
                    .andExpect(status().isOk());
            when(pipelineService.getCandidatesByStatus("ws-b", "Interviewing")).thenReturn(List.of());
            mvc.perform(get("/api/pipeline/filter").param("workspaceId", "ws-b").param("status", "Interviewing"))
                    .andExpect(status().isOk()).andExpect(content().json("[]"));
            when(pipelineService.getCandidateAuditTrail("ws-a", "candidate-a")).thenReturn(List.of());
            mvc.perform(get("/api/pipeline/candidate-a/audit").param("workspaceId", "ws-a"))
                    .andExpect(status().isOk());
            when(pipelineService.getCandidateAuditTrail("ws-b", "candidate-a")).thenReturn(List.of());
            mvc.perform(get("/api/pipeline/candidate-a/audit").param("workspaceId", "ws-b"))
                    .andExpect(status().isOk()).andExpect(content().json("[]"));
        }

        @Test
        void interviewChecklistCanBeGeneratedGradedAndRead() throws Exception {
            when(interviewService.generateInterviewChecklist(eq("ws-a"), eq("candidate-a"), eq("job-a"),
                    eq("user-a"), anyList())).thenReturn(new InterviewChecklist());
            post("/api/interviews/generate?workspaceId=ws-a&candidateId=candidate-a&jobId=job-a&generatedByUserId=user-a",
                    "{\"questions\":[\"Describe your experience\"]}").andExpect(status().isOk());
            when(interviewService.generateInterviewChecklist(eq("ws-a"), eq("foreign-candidate"), eq("job-a"),
                    eq("user-a"), anyList())).thenThrow(new IllegalArgumentException("Candidate not found."));
            post("/api/interviews/generate?workspaceId=ws-a&candidateId=foreign-candidate&jobId=job-a&generatedByUserId=user-a",
                    "{\"questions\":[]}").andExpect(status().isBadRequest());

            when(interviewService.gradeQuestion("ws-a", "question-a", true)).thenReturn(new InterviewQuestion());
            put("/api/interviews/questions/question-a?workspaceId=ws-a", "{\"isPassed\":true}")
                    .andExpect(status().isOk());
            when(interviewService.gradeQuestion("ws-a", "foreign-question", false))
                    .thenThrow(new IllegalArgumentException("Question not found in this workspace."));
            put("/api/interviews/questions/foreign-question?workspaceId=ws-a", "{\"isPassed\":false}")
                    .andExpect(status().isBadRequest());
            when(interviewService.getChecklistDetails("ws-a", "candidate-a")).thenReturn(List.of());
            mvc.perform(get("/api/interviews/candidate/candidate-a").param("workspaceId", "ws-a"))
                    .andExpect(status().isOk());
            when(interviewService.getChecklistDetails("ws-a", "foreign-candidate"))
                    .thenThrow(new IllegalArgumentException("Checklist not found for this candidate."));
            mvc.perform(get("/api/interviews/candidate/foreign-candidate").param("workspaceId", "ws-a"))
                    .andExpect(status().isBadRequest());
        }

        @Test
        void handoffIsCreatedSummarizedAndLockedAgainstEdits() throws Exception {
            when(handoffService.createHandoffReport("ws-a", "candidate-a", "job-a", "hm-a", "Recommend hire"))
                    .thenReturn(new HrHandoffReport());
            post("/api/handoffs?workspaceId=ws-a&candidateId=candidate-a&jobId=job-a&hiringManagerId=hm-a",
                    "{\"finalHmNotes\":\"Recommend hire\"}").andExpect(status().isOk());
            when(handoffService.createHandoffReport(eq("ws-a"), eq("foreign-candidate"), anyString(),
                    anyString(), anyString())).thenThrow(new IllegalArgumentException("Candidate not found."));
            post("/api/handoffs?workspaceId=ws-a&candidateId=foreign-candidate&jobId=job-a&hiringManagerId=hm-a", "{}")
                    .andExpect(status().isBadRequest());
            when(handoffService.getUnifiedSummaryReport("ws-a", "candidate-a"))
                    .thenReturn(Map.of("candidateName", "Alex", "reportStatus", "Pending HR Review"));
            mvc.perform(get("/api/handoffs/candidate/candidate-a/summary").param("workspaceId", "ws-a"))
                    .andExpect(status().isOk()).andExpect(jsonPath("$.candidateName").value("Alex"));
            when(handoffService.attemptToEditNotes("ws-a", "report-a", "Changed notes"))
                    .thenThrow(new IllegalStateException("Compliance lock."));
            put("/api/handoffs/report-a/notes?workspaceId=ws-a", "{\"finalHmNotes\":\"Changed notes\"}")
                    .andExpect(status().isForbidden());
            when(handoffService.processOffer("ws-a", "report-a")).thenReturn(new HrHandoffReport());
            mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/handoffs/report-a/process").param("workspaceId", "ws-a"))
                    .andExpect(status().isOk());
            when(handoffService.processOffer("ws-a", "foreign-report"))
                    .thenThrow(new IllegalArgumentException("Report not found."));
            mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/handoffs/foreign-report/process")
                            .param("workspaceId", "ws-a"))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    class Epic05EnterpriseAndAnalytics {
        @Test
        void engagementSequenceCanBeConfiguredToggledAndCandidateEnrolled() throws Exception {
            when(engagementService.configureSequence(eq("ws-a"), eq("user-a"), any()))
                    .thenReturn(new EngagementSequence());
            post("/api/engagements/sequences?workspaceId=ws-a&userId=user-a",
                    "{\"templateText\":\"Welcome\",\"sequenceTimingDays\":2}").andExpect(status().isOk());
            when(engagementService.configureSequence(eq("ws-a"), eq("foreign-user"), any()))
                    .thenThrow(new IllegalArgumentException("User does not belong to this workspace."));
            post("/api/engagements/sequences?workspaceId=ws-a&userId=foreign-user",
                    "{\"templateText\":\"Welcome\",\"sequenceTimingDays\":2}")
                    .andExpect(status().isBadRequest());

            when(engagementService.toggleSequenceStatus("ws-a", "sequence-a", false))
                    .thenReturn(new EngagementSequence());
            put("/api/engagements/sequences/sequence-a/toggle?workspaceId=ws-a", "{\"isActive\":false}")
                    .andExpect(status().isOk());
            when(engagementService.toggleSequenceStatus("ws-a", "foreign-sequence", true))
                    .thenThrow(new IllegalArgumentException("Sequence not found."));
            put("/api/engagements/sequences/foreign-sequence/toggle?workspaceId=ws-a", "{\"isActive\":true}")
                    .andExpect(status().isBadRequest());

            doNothing().when(engagementService).autoEnrollCandidate("ws-a", "candidate-a");
            mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/api/engagements/enroll/candidate-a").param("workspaceId", "ws-a"))
                    .andExpect(status().isOk());
            doThrow(new IllegalStateException("Candidate pipeline status must be 'Offer Accepted'."))
                    .when(engagementService).autoEnrollCandidate("ws-a", "candidate-not-offered");
            mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/api/engagements/enroll/candidate-not-offered").param("workspaceId", "ws-a"))
                    .andExpect(status().isBadRequest());
            when(engagementService.getCandidateEngagements("ws-a", "candidate-a")).thenReturn(List.of());
            mvc.perform(get("/api/engagements/candidate/candidate-a").param("workspaceId", "ws-a"))
                    .andExpect(status().isOk());
            when(engagementService.getCandidateEngagements("ws-b", "candidate-a")).thenReturn(List.of());
            mvc.perform(get("/api/engagements/candidate/candidate-a").param("workspaceId", "ws-b"))
                    .andExpect(status().isOk()).andExpect(content().json("[]"));
        }

        @Test
        void analyticsAndExportRejectCrossTenantExport() throws Exception {
            when(analyticsService.getTimeToHireMetrics(eq("ws-a"), any(), any())).thenReturn(List.of());
            mvc.perform(get("/api/analytics/time-to-hire").param("workspaceId", "ws-a")
                    .param("startDate", "2026-01-01").param("endDate", "2026-01-31"))
                    .andExpect(status().isOk());
            when(analyticsService.getTimeToHireMetrics(eq("ws-b"), any(), any())).thenReturn(List.of());
            mvc.perform(get("/api/analytics/time-to-hire").param("workspaceId", "ws-b")
                    .param("startDate", "2026-01-01").param("endDate", "2026-01-31"))
                    .andExpect(status().isOk()).andExpect(content().json("[]"));
            when(analyticsService.executeDataExport(eq("ws-a"), eq("user-a"), any(), any(), eq("CSV")))
                    .thenReturn(List.of());
            post("/api/analytics/export?workspaceId=ws-a&userId=user-a",
                    "{\"startDate\":\"2026-01-01\",\"endDate\":\"2026-01-31\",\"exportFormat\":\"CSV\"}")
                    .andExpect(status().isOk());
            when(analyticsService.executeDataExport(eq("ws-a"), eq("foreign-user"), any(), any(), anyString()))
                    .thenThrow(new IllegalArgumentException("Cross-tenant violation."));
            post("/api/analytics/export?workspaceId=ws-a&userId=foreign-user",
                    "{\"startDate\":\"2026-01-01\",\"endDate\":\"2026-01-31\",\"exportFormat\":\"CSV\"}")
                    .andExpect(status().isBadRequest());
        }

        @Test
        void tenantApiKeyConfigurationVerificationAndUsageLogging() throws Exception {
            doNothing().when(byokService).configureTenantApiKey("ws-a", "admin-a", "Gemini", "test-api-key");
            post("/api/byok/configure?workspaceId=ws-a&userId=admin-a",
                    "{\"providerName\":\"Gemini\",\"rawApiKey\":\"test-api-key\"}").andExpect(status().isOk());
            doThrow(new IllegalArgumentException("Cross-tenant violation."))
                    .when(byokService).configureTenantApiKey("ws-a", "foreign-user", "OpenAI", "key");
            post("/api/byok/configure?workspaceId=ws-a&userId=foreign-user",
                    "{\"providerName\":\"OpenAI\",\"rawApiKey\":\"key\"}").andExpect(status().isBadRequest());

            DecryptedKeyRecord decrypted = mock(DecryptedKeyRecord.class);
            when(decrypted.getProviderName()).thenReturn("Gemini");
            when(decrypted.getDecryptedApiKey()).thenReturn("decrypted-test-key");
            when(byokService.getDecryptedKey("ws-a")).thenReturn(decrypted);
            mvc.perform(get("/api/byok/verify-key").param("workspaceId", "ws-a"))
                    .andExpect(status().isOk()).andExpect(jsonPath("$.provider").value("Gemini"));
            when(byokService.getDecryptedKey("empty-workspace"))
                    .thenThrow(new IllegalArgumentException("No active API key found."));
            mvc.perform(get("/api/byok/verify-key").param("workspaceId", "empty-workspace"))
                    .andExpect(status().isBadRequest());

            when(byokService.logApiUsage("ws-a", "Gemini", "/generate", "200")).thenReturn(new ApiUsageLog());
            post("/api/byok/log?workspaceId=ws-a",
                    "{\"providerName\":\"Gemini\",\"endpointCalled\":\"/generate\",\"responseStatus\":\"200\"}")
                    .andExpect(status().isOk());
            post("/api/byok/log",
                    "{\"providerName\":\"Gemini\",\"endpointCalled\":\"/generate\",\"responseStatus\":\"200\"}")
                    .andExpect(status().isBadRequest());
            when(byokService.getUsageLogs("ws-a")).thenReturn(List.of());
            mvc.perform(get("/api/byok/logs").param("workspaceId", "ws-a")).andExpect(status().isOk());
            mvc.perform(get("/api/byok/logs")).andExpect(status().isBadRequest());
        }
    }
}
