package com.racsai.backend.service;

import com.racsai.backend.entity.*;
import com.racsai.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InterviewService {

    @Autowired
    private InterviewChecklistRepository checklistRepository;

    @Autowired
    private InterviewQuestionRepository questionRepository;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private UserRepository userRepository;

    // Queries 51 & 52: Initialize Header and Save AI Questions
    @Transactional
    public InterviewChecklist generateInterviewChecklist(String workspaceId, String candidateId, String jobId, String generatedByUserId, List<String> generatedQuestions) {
        Workspace workspace = workspaceRepository.findById(workspaceId).orElseThrow();
        Candidate candidate = candidateRepository.findByCandidateIdAndWorkspace_WorkspaceId(candidateId, workspaceId).orElseThrow();
        JobPosting job = jobPostingRepository.findById(jobId).orElseThrow();
        User author = userRepository.findById(generatedByUserId).orElseThrow();

        if (!author.getWorkspace().getWorkspaceId().equals(workspaceId)) {
            throw new IllegalArgumentException("User does not belong to this workspace.");
        }

        // Query 51: Initialize the Header
        InterviewChecklist checklist = new InterviewChecklist();
        checklist.setWorkspace(workspace);
        checklist.setCandidate(candidate);
        checklist.setJobPosting(job);
        checklist.setGeneratedBy(author);
        checklist.setInterviewStatus("Draft");
        checklist = checklistRepository.save(checklist);

        // Query 52: Save the AI-Generated Questions dynamically
        for (String qText : generatedQuestions) {
            InterviewQuestion question = new InterviewQuestion();
            question.setChecklist(checklist);
            question.setQuestionText(qText);
            question.setIsPassed(null);
            questionRepository.save(question);
        }

        return checklist;
    }

    // Query 53: Mark Question as Passed/Failed during live interview
    public InterviewQuestion gradeQuestion(String workspaceId, String questionId, Boolean isPassed) {
        InterviewQuestion question = questionRepository.findByQuestionIdAndChecklist_Workspace_WorkspaceId(questionId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Question not found in this workspace."));

        question.setIsPassed(isPassed);
        return questionRepository.save(question);
    }

    // Query 54: View Completed Checklist (Read-Only)
    public List<InterviewQuestion> getChecklistDetails(String workspaceId, String candidateId) {
        InterviewChecklist checklist = checklistRepository.findByCandidate_CandidateIdAndWorkspace_WorkspaceId(candidateId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Checklist not found for this candidate."));

        return questionRepository.findByChecklist_ChecklistIdOrderByCreatedAtAsc(checklist.getChecklistId());
    }
}