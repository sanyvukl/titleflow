package com.titleflow.document;

import com.titleflow.application.TitleApplication;
import com.titleflow.user.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "documents",
        indexes = {
                @Index(name = "idx_documents_title_application_id", columnList = "title_application_id"),
                @Index(name = "idx_documents_uploaded_by_user_id", columnList = "uploaded_by_user_id"),
                @Index(name = "idx_documents_document_type", columnList = "document_type"),
                @Index(name = "idx_documents_uploaded_at", columnList = "uploaded_at")
        }
)
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "title_application_id", nullable = false)
    private TitleApplication titleApplication;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "uploaded_by_user_id", nullable = false)
    private User uploadedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false, length = 100)
    private DocumentType documentType;

    @Column(name = "original_file_name", nullable = false, length = 255)
    private String originalFileName;

    @Column(name = "storage_key", nullable = false, unique = true, length = 500)
    private String storageKey;

    @Column(name = "content_type", nullable = false, length = 100)
    private String contentType;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;

    protected Document() {
    }

    public Document(
            TitleApplication titleApplication,
            User uploadedBy,
            DocumentType documentType,
            String originalFileName,
            String storageKey,
            String contentType,
            Long fileSize
    ) {
        this.titleApplication = titleApplication;
        this.uploadedBy = uploadedBy;
        this.documentType = documentType;
        this.originalFileName = originalFileName;
        this.storageKey = storageKey;
        this.contentType = contentType;
        this.fileSize = fileSize;
    }

    @PrePersist
    protected void onCreate() {
        this.uploadedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public TitleApplication getTitleApplication() {
        return titleApplication;
    }

    public User getUploadedBy() {
        return uploadedBy;
    }

    public DocumentType getDocumentType() {
        return documentType;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public String getStorageKey() {
        return storageKey;
    }

    public String getContentType() {
        return contentType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
}