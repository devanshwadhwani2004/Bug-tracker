
package com.bugtracker.dto;

import com.bugtracker.entity.IssuePriority;
import com.bugtracker.entity.IssueStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class IssueResponse {

    private Long id;
    private String issueKey;
    private String title;
    private String description;
    private IssueStatus status;
    private IssuePriority priority;

    private Long projectId;
    private String projectName;

    private Long reporterId;
    private String reporterName;

    private Long assigneeId;
    private String assigneeName;

    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public IssueResponse(
            Long id,
            String issueKey,
            String title,
            String description,
            IssueStatus status,
            IssuePriority priority,
            Long projectId,
            String projectName,
            Long reporterId,
            String reporterName,
            Long assigneeId,
            String assigneeName,
            LocalDate dueDate,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.issueKey = issueKey;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.projectId = projectId;
        this.projectName = projectName;
        this.reporterId = reporterId;
        this.reporterName = reporterName;
        this.assigneeId = assigneeId;
        this.assigneeName = assigneeName;
        this.dueDate = dueDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public String getIssueKey() { return issueKey; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public IssueStatus getStatus() { return status; }
    public IssuePriority getPriority() { return priority; }
    public Long getProjectId() { return projectId; }
    public String getProjectName() { return projectName; }
    public Long getReporterId() { return reporterId; }
    public String getReporterName() { return reporterName; }
    public Long getAssigneeId() { return assigneeId; }
    public String getAssigneeName() { return assigneeName; }
    public LocalDate getDueDate() { return dueDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}