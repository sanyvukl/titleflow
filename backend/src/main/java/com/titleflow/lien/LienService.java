package com.titleflow.lien;

import com.titleflow.application.TitleApplication;
import com.titleflow.application.TitleApplicationRepository;
import com.titleflow.application.TitleApplicationStatus;
import com.titleflow.lien.dto.CreateLienRequest;
import com.titleflow.lien.dto.LienResponse;
import com.titleflow.user.RoleName;
import com.titleflow.user.User;
import com.titleflow.user.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titleflow.audit.AuditAction;
import com.titleflow.audit.AuditLogService;

import java.util.List;

@Service
public class LienService {

    private final LienRepository lienRepository;
    private final TitleApplicationRepository titleApplicationRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public LienService(
            LienRepository lienRepository,
            TitleApplicationRepository titleApplicationRepository,
            UserRepository userRepository, AuditLogService auditLogService
    ) {
        this.lienRepository = lienRepository;
        this.titleApplicationRepository = titleApplicationRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public LienResponse createLien(
            Long titleApplicationId,
            CreateLienRequest request,
            String lenderEmail
    ) {
        User lender = findUserByEmail(lenderEmail);
        validateRole(lender, RoleName.LENDER, "Only lenders can create liens");

        TitleApplication application = findTitleApplicationById(titleApplicationId);

        validateApplicationAllowsLienCreation(application);

        if (lienRepository.existsByTitleApplicationIdAndStatus(titleApplicationId, LienStatus.ACTIVE)) {
            throw new IllegalArgumentException("This title application already has an active lien");
        }

        Lien lien = new Lien(
                application,
                lender,
                trim(request.lenderName()),
                trim(request.lienholderAddress()),
                trim(request.loanAccountNumber())
        );

        Lien savedLien = lienRepository.save(lien);

        auditLogService.recordApplicationAction(
                application,
                lender,
                AuditAction.LIEN_CREATED,
                null,
                savedLien.getStatus().name(),
                "Lender created active lien for title application "
                        + application.getApplicationNumber()
                        + " with lender name "
                        + savedLien.getLenderName()
        );

        return toResponse(savedLien);
    }

    @Transactional(readOnly = true)
    public List<LienResponse> getLiensForApplication(
            Long titleApplicationId,
            String currentUserEmail
    ) {
        User currentUser = findUserByEmail(currentUserEmail);
        TitleApplication application = findTitleApplicationById(titleApplicationId);

        List<Lien> liens = lienRepository.findByTitleApplicationIdOrderByCreatedAtDesc(titleApplicationId);

        if (hasRole(currentUser, RoleName.ADMIN) || hasRole(currentUser, RoleName.DMV_CLERK)) {
            return liens.stream()
                    .map(this::toResponse)
                    .toList();
        }

        if (hasRole(currentUser, RoleName.DEALER) && applicationBelongsToDealer(application, currentUser)) {
            return liens.stream()
                    .map(this::toResponse)
                    .toList();
        }

        if (hasRole(currentUser, RoleName.LENDER)) {
            return liens.stream()
                    .filter(lien -> lien.getLender().getId().equals(currentUser.getId()))
                    .map(this::toResponse)
                    .toList();
        }

        throw new AccessDeniedException("You do not have permission to view liens for this application");
    }

    @Transactional(readOnly = true)
    public List<LienResponse> getMyLiens(String lenderEmail) {
        User lender = findUserByEmail(lenderEmail);
        validateRole(lender, RoleName.LENDER, "Only lenders can view their lien dashboard");

        return lienRepository.findByLenderIdOrderByCreatedAtDesc(lender.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public LienResponse releaseLien(
            Long titleApplicationId,
            Long lienId,
            String lenderEmail
    ) {
        User lender = findUserByEmail(lenderEmail);
        validateRole(lender, RoleName.LENDER, "Only lenders can release liens");

        Lien lien = lienRepository.findByIdAndTitleApplicationId(lienId, titleApplicationId)
                .orElseThrow(() -> new IllegalArgumentException("Lien not found"));

        if (!lien.getLender().getId().equals(lender.getId())) {
            throw new AccessDeniedException("Lender can release only their own liens");
        }

        LienStatus oldStatus = lien.getStatus();

        lien.release();

        Lien savedLien = lienRepository.save(lien);

        auditLogService.recordApplicationAction(
                savedLien.getTitleApplication(),
                lender,
                AuditAction.LIEN_RELEASED,
                oldStatus.name(),
                savedLien.getStatus().name(),
                "Lender released lien for title application "
                        + savedLien.getTitleApplication().getApplicationNumber()
                        + " with lender name "
                        + savedLien.getLenderName()
        );

        return toResponse(savedLien);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Current user not found"));
    }

    private TitleApplication findTitleApplicationById(Long titleApplicationId) {
        return titleApplicationRepository.findById(titleApplicationId)
                .orElseThrow(() -> new IllegalArgumentException("Title application not found"));
    }

    private void validateApplicationAllowsLienCreation(TitleApplication application) {
        if (application.getStatus() == TitleApplicationStatus.SUBMITTED
                || application.getStatus() == TitleApplicationStatus.UNDER_REVIEW
                || application.getStatus() == TitleApplicationStatus.NEEDS_MORE_INFO) {
            return;
        }

        throw new IllegalArgumentException(
                "Liens can only be created for submitted or review-stage applications"
        );
    }

    private void validateRole(User user, RoleName roleName, String message) {
        if (!hasRole(user, roleName)) {
            throw new AccessDeniedException(message);
        }
    }

    private boolean hasRole(User user, RoleName roleName) {
        return user.getRoles()
                .stream()
                .anyMatch(role -> role.getName() == roleName);
    }

    private boolean applicationBelongsToDealer(TitleApplication application, User dealer) {
        return application.getDealer() != null
                && application.getDealer().getId().equals(dealer.getId());
    }

    private LienResponse toResponse(Lien lien) {
        TitleApplication application = lien.getTitleApplication();
        User lender = lien.getLender();

        return new LienResponse(
                lien.getId(),
                application.getId(),
                application.getApplicationNumber(),
                lender.getId(),
                lender.getEmail(),
                lien.getLenderName(),
                lien.getLienholderAddress(),
                lien.getLoanAccountNumber(),
                lien.getStatus(),
                lien.getCreatedAt(),
                lien.getReleasedAt()
        );
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }
}