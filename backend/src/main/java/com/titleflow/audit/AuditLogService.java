package com.titleflow.audit;

import com.titleflow.application.TitleApplication;
import com.titleflow.application.TitleApplicationRepository;
import com.titleflow.audit.dto.AuditLogResponse;
import com.titleflow.user.RoleName;
import com.titleflow.user.User;
import com.titleflow.user.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final TitleApplicationRepository titleApplicationRepository;
    private final UserRepository userRepository;

    public AuditLogService(
            AuditLogRepository auditLogRepository,
            TitleApplicationRepository titleApplicationRepository,
            UserRepository userRepository
    ) {
        this.auditLogRepository = auditLogRepository;
        this.titleApplicationRepository = titleApplicationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void recordApplicationAction(
            TitleApplication titleApplication,
            User actor,
            AuditAction action,
            String oldValue,
            String newValue,
            String description
    ) {
        AuditLog auditLog = new AuditLog(
                titleApplication,
                actor,
                action,
                oldValue,
                newValue,
                description
        );

        auditLogRepository.save(auditLog);
    }

    @Transactional(readOnly = true)
    public List<AuditLogResponse> getAuditLogsForApplication(
            Long titleApplicationId,
            String currentUserEmail
    ) {
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("Current user not found"));

        TitleApplication application = titleApplicationRepository.findById(titleApplicationId)
                .orElseThrow(() -> new IllegalArgumentException("Title application not found"));

        if (!canViewAuditLogs(currentUser, application)) {
            throw new AccessDeniedException("You do not have permission to view audit logs for this application");
        }

        return auditLogRepository
                .findByTitleApplicationIdOrderByCreatedAtAsc(titleApplicationId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private boolean canViewAuditLogs(User user, TitleApplication application) {
        if (hasRole(user, RoleName.ADMIN) || hasRole(user, RoleName.DMV_CLERK)) {
            return true;
        }

        if (hasRole(user, RoleName.DEALER)) {
            return application.getDealer() != null
                    && application.getDealer().getId().equals(user.getId());
        }

        return false;
    }

    private boolean hasRole(User user, RoleName roleName) {
        return user.getRoles()
                .stream()
                .anyMatch(role -> role.getName() == roleName);
    }

    private AuditLogResponse toResponse(AuditLog auditLog) {
        TitleApplication application = auditLog.getTitleApplication();
        User actor = auditLog.getActor();

        return new AuditLogResponse(
                auditLog.getId(),
                application != null ? application.getId() : null,
                application != null ? application.getApplicationNumber() : null,
                actor.getId(),
                actor.getEmail(),
                auditLog.getAction(),
                auditLog.getOldValue(),
                auditLog.getNewValue(),
                auditLog.getDescription(),
                auditLog.getCreatedAt()
        );
    }
}