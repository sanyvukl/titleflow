package com.titleflow.audit.dto;

import com.titleflow.audit.AuditAction;

import java.time.LocalDateTime;

public record AuditLogResponse(
        Long id,
        Long titleApplicationId,
        String applicationNumber,
        Long actorUserId,
        String actorEmail,
        AuditAction action,
        String oldValue,
        String newValue,
        String description,
        LocalDateTime createdAt
) {
}