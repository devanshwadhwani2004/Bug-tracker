
package com.bugtracker.repository;

import com.bugtracker.entity.Issue;
import com.bugtracker.entity.IssueStatus;
import com.bugtracker.entity.IssuePriority;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IssueRepository extends JpaRepository<Issue, Long> {

    List<Issue> findByProjectId(Long projectId);

    List<Issue> findByAssigneeId(Long assigneeId);

    List<Issue> findByReporterId(Long reporterId);

    List<Issue> findByStatus(IssueStatus status);

    List<Issue> findByPriority(IssuePriority priority);

    List<Issue> findByProjectIdAndStatus(
            Long projectId,
            IssueStatus status
    );

    List<Issue> findByProjectIdAndPriority(
            Long projectId,
            IssuePriority priority
    );

    Optional<Issue> findByIssueKey(String issueKey);

    boolean existsByIssueKey(String issueKey);
}
