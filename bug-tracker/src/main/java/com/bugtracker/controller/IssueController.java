package com.bugtracker.controller;

import com.bugtracker.dto.IssueRequest;
import com.bugtracker.dto.IssueResponse;
import com.bugtracker.service.IssueService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = "http://localhost:5173")
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    // CREATE ISSUE
    @PostMapping
    public ResponseEntity<IssueResponse> createIssue(
            @RequestBody IssueRequest request,
            Authentication authentication) {

        IssueResponse response = issueService.createIssue(
                request,
                authentication.getName()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // GET ALL ISSUES
    @GetMapping
    public ResponseEntity<List<IssueResponse>> getAllIssues() {

        return ResponseEntity.ok(
                issueService.getAllIssues()
        );
    }

    // GET ISSUE BY ID
    @GetMapping("/{id}")
    public ResponseEntity<IssueResponse> getIssueById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                issueService.getIssueById(id)
        );
    }

    // GET ISSUES BY PROJECT
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<IssueResponse>> getIssuesByProject(
            @PathVariable Long projectId) {

        return ResponseEntity.ok(
                issueService.getIssuesByProject(projectId)
        );
    }

    // GET ISSUES BY ASSIGNEE
    @GetMapping("/assignee/{assigneeId}")
    public ResponseEntity<List<IssueResponse>> getIssuesByAssignee(
            @PathVariable Long assigneeId) {

        return ResponseEntity.ok(
                issueService.getIssuesByAssignee(assigneeId)
        );
    }

    // UPDATE ISSUE
    @PutMapping("/{id}")
    public ResponseEntity<IssueResponse> updateIssue(
            @PathVariable Long id,
            @RequestBody IssueRequest request) {

        return ResponseEntity.ok(
                issueService.updateIssue(id, request)
        );
    }

    // DELETE ISSUE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteIssue(
            @PathVariable Long id) {

        issueService.deleteIssue(id);

        return ResponseEntity.ok(
                "Issue deleted successfully!"
        );
    }
}