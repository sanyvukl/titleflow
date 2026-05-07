package com.titleflow.audit;

import com.titleflow.audit.dto.AuditLogResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/title-applications/{applicationId}/audit-logs")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @PreAuthorize("hasAnyRole('DEALER', 'DMV_CLERK', 'ADMIN')")
    @GetMapping
    public List<AuditLogResponse> getAuditLogsForApplication(
            @PathVariable Long applicationId,
            Authentication authentication
    ) {
        return auditLogService.getAuditLogsForApplication(
                applicationId,
                authentication.getName()
        );
    }
}