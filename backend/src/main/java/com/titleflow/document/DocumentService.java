package com.titleflow.document;

import com.titleflow.application.TitleApplication;
import com.titleflow.application.TitleApplicationRepository;
import com.titleflow.application.TitleApplicationStatus;
import com.titleflow.document.dto.DocumentResponse;
import com.titleflow.user.RoleName;
import com.titleflow.user.User;
import com.titleflow.user.UserRepository;
import com.titleflow.audit.AuditAction;
import com.titleflow.audit.AuditLogService;
import org.springframework.core.io.Resource;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final TitleApplicationRepository titleApplicationRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;
    private final DocumentFileValidator documentFileValidator;
    private final AuditLogService auditLogService;

    public DocumentService(
            DocumentRepository documentRepository,
            TitleApplicationRepository titleApplicationRepository,
            UserRepository userRepository,
            StorageService storageService,
            DocumentFileValidator documentFileValidator,
            AuditLogService auditLogService
    ) {
        this.documentRepository = documentRepository;
        this.titleApplicationRepository = titleApplicationRepository;
        this.userRepository = userRepository;
        this.storageService = storageService;
        this.documentFileValidator = documentFileValidator;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public DocumentResponse uploadDocument(
            Long titleApplicationId,
            DocumentType documentType,
            MultipartFile file,
            String currentUserEmail
    ) {
        User currentUser = findUserByEmail(currentUserEmail);
        TitleApplication application = findTitleApplicationById(titleApplicationId);

        validateUploadAccess(currentUser, application);
        validateApplicationAllowsUpload(application);

        documentFileValidator.validate(file);

        StoredFile storedFile = storageService.store(file);

        try {
            Document document = new Document(
                    application,
                    currentUser,
                    documentType,
                    storedFile.originalFileName(),
                    storedFile.storageKey(),
                    storedFile.contentType(),
                    storedFile.fileSize()
            );

            Document savedDocument = documentRepository.save(document);

            auditLogService.recordApplicationAction(
                    application,
                    currentUser,
                    AuditAction.DOCUMENT_UPLOADED,
                    null,
                    savedDocument.getDocumentType().name(),
                    "Dealer uploaded " + savedDocument.getDocumentType().name()
                            + " document "
                            + savedDocument.getOriginalFileName()
                            + " for title application "
                            + application.getApplicationNumber()
            );

            return toResponse(savedDocument);
        } catch (RuntimeException ex) {
            storageService.delete(storedFile.storageKey());
            throw ex;
        }
    }

    @Transactional(readOnly = true)
    public List<DocumentResponse> getDocumentsForApplication(
            Long titleApplicationId,
            String currentUserEmail
    ) {
        User currentUser = findUserByEmail(currentUserEmail);
        TitleApplication application = findTitleApplicationById(titleApplicationId);

        validateViewAccess(currentUser, application);

        return documentRepository
                .findByTitleApplicationIdOrderByUploadedAtDesc(titleApplicationId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public DocumentDownload downloadDocument(
            Long titleApplicationId,
            Long documentId,
            String currentUserEmail
    ) {
        User currentUser = findUserByEmail(currentUserEmail);
        TitleApplication application = findTitleApplicationById(titleApplicationId);

        validateViewAccess(currentUser, application);

        Document document = documentRepository
                .findByIdAndTitleApplicationId(documentId, titleApplicationId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));

        Resource resource = storageService.loadAsResource(document.getStorageKey());

        return new DocumentDownload(
                resource,
                document.getOriginalFileName(),
                document.getContentType(),
                document.getFileSize()
        );
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Current user not found"));
    }

    private TitleApplication findTitleApplicationById(Long titleApplicationId) {
        return titleApplicationRepository.findById(titleApplicationId)
                .orElseThrow(() -> new IllegalArgumentException("Title application not found"));
    }

    private void validateUploadAccess(User user, TitleApplication application) {
        if (!hasRole(user, RoleName.DEALER)) {
            throw new AccessDeniedException("Only dealers can upload documents");
        }

        if (application.getDealer() == null || !application.getDealer().getId().equals(user.getId())) {
            throw new AccessDeniedException("Dealer can upload documents only to their own applications");
        }
    }

    private void validateViewAccess(User user, TitleApplication application) {
        if (hasRole(user, RoleName.ADMIN) || hasRole(user, RoleName.DMV_CLERK)) {
            return;
        }

        if (hasRole(user, RoleName.DEALER)
                && application.getDealer() != null
                && application.getDealer().getId().equals(user.getId())) {
            return;
        }

        throw new AccessDeniedException("You do not have permission to access documents for this application");
    }

    private void validateApplicationAllowsUpload(TitleApplication application) {
        if (application.getStatus() == TitleApplicationStatus.DRAFT
                || application.getStatus() == TitleApplicationStatus.NEEDS_MORE_INFO) {
            return;
        }

        throw new IllegalArgumentException(
                "Documents can only be uploaded while application is in DRAFT or NEEDS_MORE_INFO status"
        );
    }

    private boolean hasRole(User user, RoleName roleName) {
        return user.getRoles()
                .stream()
                .anyMatch(role -> role.getName() == roleName);
    }

    private DocumentResponse toResponse(Document document) {
        TitleApplication application = document.getTitleApplication();
        User uploadedBy = document.getUploadedBy();

        return new DocumentResponse(
                document.getId(),
                application.getId(),
                application.getApplicationNumber(),
                uploadedBy.getId(),
                uploadedBy.getEmail(),
                document.getDocumentType(),
                document.getOriginalFileName(),
                document.getContentType(),
                document.getFileSize(),
                document.getUploadedAt()
        );
    }
}