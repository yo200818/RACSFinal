package com.racsai.backend.service;

import com.racsai.backend.entity.JobPosting;
import com.racsai.backend.entity.User;
import com.racsai.backend.entity.Workspace;
import com.racsai.backend.repository.JobPostingRepository;
import com.racsai.backend.repository.UserRepository;
import com.racsai.backend.repository.WorkspaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobPostingService {

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private UserRepository userRepository;

    // Queries 23 & 24: Insert New Job Description & Validate Mandatory Fields
    public JobPosting createJobPosting(String workspaceId, String createdByUserId, JobPosting request) {
        
        // Query 24: Backend validation to ensure no incomplete data is accepted
        //if (isBlank(request.getJobTitle()) || isBlank(request.getRequiredSkills()) || isBlank(request.getFullDescription())) {
        //    throw new IllegalArgumentException("Job Title, Required Skills, and Full Description are mandatory fields.");
        //}

        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found."));

        User creator = userRepository.findById(createdByUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (!creator.getWorkspace().getWorkspaceId().equals(workspaceId)) {
            throw new IllegalArgumentException("User does not belong to this workspace.");
        }

        JobPosting job = new JobPosting();
        job.setWorkspace(workspace);
        job.setCreatedBy(creator);
        job.setJobTitle(request.getJobTitle());
        job.setDepartment(request.getDepartment());
        job.setMinExperienceYears(request.getMinExperienceYears());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setFullDescription(request.getFullDescription());
        job.setEmploymentType(request.getEmploymentType());
        job.setStatus("Active");

        return jobPostingRepository.save(job);
    }

    // Query 25: View All Active Job Postings for Dashboard
    public List<JobPosting> getActiveJobsByWorkspace(String workspaceId) {
        return jobPostingRepository.findByWorkspace_WorkspaceIdAndStatusOrderByCreatedAtDesc(workspaceId, "Active");
    }

    // Query 26: View Specific Job Description Details
    public JobPosting getJobDetails(String workspaceId, String jobId) {
        return jobPostingRepository.findByJobIdAndWorkspace_WorkspaceId(jobId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found or access denied."));
    }

    // Query 27: Edit Job Posting (TA / Admin)
    public JobPosting updateJobPosting(String workspaceId, String jobId, JobPosting updateRequest) {
        JobPosting existingJob = getJobDetails(workspaceId, jobId);

        if (existingJob.getStatus().equals("Deleted")) {
            throw new IllegalArgumentException("Cannot edit a deleted job posting.");
        }

        // Update strictly the permitted AI benchmark fields
        existingJob.setJobTitle(updateRequest.getJobTitle());
        existingJob.setDepartment(updateRequest.getDepartment());
        existingJob.setMinExperienceYears(updateRequest.getMinExperienceYears());
        existingJob.setRequiredSkills(updateRequest.getRequiredSkills());
        existingJob.setFullDescription(updateRequest.getFullDescription());
        existingJob.setEmploymentType(updateRequest.getEmploymentType());

        return jobPostingRepository.save(existingJob);
    }

    // Query 28: Delete Job Posting (Soft Delete)
    public void softDeleteJob(String workspaceId, String jobId) {
        JobPosting existingJob = getJobDetails(workspaceId, jobId);
        existingJob.setStatus("Deleted");
        jobPostingRepository.save(existingJob);
    }

    //private boolean isBlank(String str) {
    //  return str == null || str.trim().isEmpty();
    //}
}