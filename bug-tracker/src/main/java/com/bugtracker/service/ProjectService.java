
package com.bugtracker.service;

import com.bugtracker.dto.ProjectRequest;
import com.bugtracker.dto.ProjectResponse;

import com.bugtracker.entity.Project;
import com.bugtracker.entity.ProjectStatus;
import com.bugtracker.entity.User;

import com.bugtracker.repository.ProjectRepository;
import com.bugtracker.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(
            ProjectRepository projectRepository,
            UserRepository userRepository) {

        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    // Create Project
    @Transactional
    public ProjectResponse createProject(
            ProjectRequest request,
            String managerEmail) {

        User manager = userRepository.findByEmail(managerEmail)
                .orElseThrow(() ->
                        new RuntimeException("Manager not found!")
                );

        Project project = new Project();

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStatus(
                request.getStatus() != null
                        ? request.getStatus()
                        : ProjectStatus.ACTIVE
        );
        project.setManager(manager);

        Project savedProject = projectRepository.save(project);

        return convertToResponse(savedProject);
    }

    // Get All Projects
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects() {

        return projectRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get Project By ID
    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long id) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Project not found!")
                );

        return convertToResponse(project);
    }

    // Get Projects By Manager
    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjectsByManager(Long managerId) {

        return projectRepository.findByManagerId(managerId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Update Project
    @Transactional
    public ProjectResponse updateProject(
            Long id,
            ProjectRequest request) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Project not found!")
                );

        project.setName(request.getName());
        project.setDescription(request.getDescription());

        if (request.getStatus() != null) {
            project.setStatus(request.getStatus());
        }

        Project updatedProject = projectRepository.save(project);

        return convertToResponse(updatedProject);
    }

    // Delete Project
    public void deleteProject(Long id) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Project not found!")
                );

        projectRepository.delete(project);
    }

    // Convert Entity to Response DTO
    private ProjectResponse convertToResponse(Project project) {

        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getStatus(),
                project.getManager().getId(),
                project.getManager().getName(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
    }
}
