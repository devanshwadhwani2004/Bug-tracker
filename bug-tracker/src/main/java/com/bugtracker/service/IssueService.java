package com.bugtracker.service;

import com.bugtracker.dto.IssueRequest;
import com.bugtracker.dto.IssueResponse;
import com.bugtracker.entity.*;
import com.bugtracker.repository.IssueRepository;
import com.bugtracker.repository.ProjectRepository;
import com.bugtracker.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class IssueService {

    private final IssueRepository issueRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public IssueService(
            IssueRepository issueRepository,
            ProjectRepository projectRepository,
            UserRepository userRepository) {

        this.issueRepository = issueRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    // CREATE ISSUE
    @Transactional
    public IssueResponse createIssue(
            IssueRequest request,
            String reporterEmail) {

        if (request.getTitle() == null ||
                request.getTitle().isBlank()) {

            throw new IllegalArgumentException(
                    "Issue title is required!"
            );
        }

        Project project = projectRepository
                .findById(request.getProjectId())
                .orElseThrow(() ->
                        new RuntimeException("Project not found!")
                );

        User reporter = userRepository
                .findByEmail(reporterEmail)
                .orElseThrow(() ->
                        new RuntimeException("Reporter not found!")
                );

        Issue issue = new Issue();

        issue.setTitle(request.getTitle());
        issue.setDescription(request.getDescription());

        issue.setStatus(
                request.getStatus() != null
                        ? request.getStatus()
                        : IssueStatus.TODO
        );

        issue.setPriority(
                request.getPriority() != null
                        ? request.getPriority()
                        : IssuePriority.MEDIUM
        );

        issue.setProject(project);
        issue.setReporter(reporter);

        // Assign user if assignee ID is provided
        if (request.getAssigneeId() != null) {

            User assignee = userRepository
                    .findById(request.getAssigneeId())
                    .orElseThrow(() ->
                            new RuntimeException("Assignee not found!")
                    );

            issue.setAssignee(assignee);
        }

        issue.setDueDate(request.getDueDate());

        // Set temporary unique key before first database insert
        issue.setIssueKey(
                "TMP-" + UUID.randomUUID()
        );

        // First save generates the database ID
        Issue savedIssue = issueRepository.saveAndFlush(issue);

        // Generate final issue key using database ID
        savedIssue.setIssueKey(
                "BUG-" + savedIssue.getId()
        );

        // Save the final issue key
        Issue finalIssue = issueRepository.save(savedIssue);

        return convertToResponse(finalIssue);
    }

    // GET ALL ISSUES
    @Transactional(readOnly = true)
    public List<IssueResponse> getAllIssues() {

        return issueRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // GET ISSUE BY ID
    @Transactional(readOnly = true)
    public IssueResponse getIssueById(Long id) {

        Issue issue = issueRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Issue not found!")
                );

        return convertToResponse(issue);
    }

    // GET ISSUES BY PROJECT
    @Transactional(readOnly = true)
    public List<IssueResponse> getIssuesByProject(Long projectId) {

        return issueRepository.findByProjectId(projectId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // GET ISSUES BY ASSIGNEE
    @Transactional(readOnly = true)
    public List<IssueResponse> getIssuesByAssignee(Long assigneeId) {

        return issueRepository.findByAssigneeId(assigneeId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // UPDATE ISSUE
    @Transactional
    public IssueResponse updateIssue(
            Long id,
            IssueRequest request) {

        Issue issue = issueRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Issue not found!")
                );

        if (request.getTitle() != null &&
                !request.getTitle().isBlank()) {

            issue.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            issue.setDescription(request.getDescription());
        }

        if (request.getStatus() != null) {
            issue.setStatus(request.getStatus());
        }

        if (request.getPriority() != null) {
            issue.setPriority(request.getPriority());
        }

        if (request.getAssigneeId() != null) {

            User assignee = userRepository
                    .findById(request.getAssigneeId())
                    .orElseThrow(() ->
                            new RuntimeException("Assignee not found!")
                    );

            issue.setAssignee(assignee);
        }

        if (request.getDueDate() != null) {
            issue.setDueDate(request.getDueDate());
        }

        return convertToResponse(
                issueRepository.save(issue)
        );
    }

    // DELETE ISSUE
    @Transactional
    public void deleteIssue(Long id) {

        Issue issue = issueRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Issue not found!")
                );

        issueRepository.delete(issue);
    }

    // CONVERT ENTITY TO RESPONSE
    private IssueResponse convertToResponse(Issue issue) {

        return new IssueResponse(
                issue.getId(),
                issue.getIssueKey(),
                issue.getTitle(),
                issue.getDescription(),
                issue.getStatus(),
                issue.getPriority(),
                issue.getProject().getId(),
                issue.getProject().getName(),
                issue.getReporter().getId(),
                issue.getReporter().getName(),
                issue.getAssignee() != null
                        ? issue.getAssignee().getId()
                        : null,
                issue.getAssignee() != null
                        ? issue.getAssignee().getName()
                        : null,
                issue.getDueDate(),
                issue.getCreatedAt(),
                issue.getUpdatedAt()
        );
    }
}