package com.racsai.backend.repository;

import com.racsai.backend.entity.InterviewQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, String> {
    // Used for Query 53 (Update) and Query 54 (Read Checklist)
    Optional<InterviewQuestion> findByQuestionIdAndChecklist_Workspace_WorkspaceId(String questionId, String workspaceId);
    List<InterviewQuestion> findByChecklist_ChecklistIdOrderByCreatedAtAsc(String checklistId);
}