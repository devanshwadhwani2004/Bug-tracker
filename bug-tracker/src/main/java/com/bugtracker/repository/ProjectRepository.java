
package com.bugtracker.repository;

import com.bugtracker.entity.Project;
import com.bugtracker.entity.ProjectStatus;
import com.bugtracker.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    // Find projects managed by a particular user
    List<Project> findByManager(User manager);

    // Find projects by status
    List<Project> findByStatus(ProjectStatus status);

    // Search projects by name
    List<Project> findByNameContainingIgnoreCase(String name);

    // Find projects managed by a user with a particular ID
    List<Project> findByManagerId(Long managerId);
}
