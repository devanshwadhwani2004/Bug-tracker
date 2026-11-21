
package com.bugtracker.dto;

import com.bugtracker.entity.ProjectStatus;

import java.time.LocalDateTime;

public class ProjectResponse {

    private Long id;
    private String name;
    private String description;
    private ProjectStatus status;
    private Long managerId;
    private String managerName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProjectResponse(
            Long id,
            String name,
            String description,
            ProjectStatus status,
            Long managerId,
            String managerName,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
        this.managerId = managerId;
        this.managerName = managerName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public Long getManagerId() {
        return managerId;
    }

    public String getManagerName() {
        return managerName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
