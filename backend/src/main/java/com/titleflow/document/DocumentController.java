package com.titleflow.document;

import com.titleflow.document.dto.DocumentResponse;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/title-applications/{applicationId}/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PreAuthorize("hasRole('DEALER')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public DocumentResponse uploadDocument(
            @PathVariable Long applicationId,
            @RequestParam("documentType") DocumentType documentType,
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        return documentService.uploadDocument(
                applicationId,
                documentType,
                file,
                authentication.getName()
        );
    }

    @PreAuthorize("hasAnyRole('DEALER', 'DMV_CLERK', 'ADMIN')")
    @GetMapping
    public List<DocumentResponse> getDocumentsForApplication(
            @PathVariable Long applicationId,
            Authentication authentication
    ) {
        return documentService.getDocumentsForApplication(
                applicationId,
                authentication.getName()
        );
    }

    @PreAuthorize("hasAnyRole('DEALER', 'DMV_CLERK', 'ADMIN')")
    @GetMapping("/{documentId}/download")
    public ResponseEntity<Resource> downloadDocument(
            @PathVariable Long applicationId,
            @PathVariable Long documentId,
            Authentication authentication
    ) {
        DocumentDownload download = documentService.downloadDocument(
                applicationId,
                documentId,
                authentication.getName()
        );

        ContentDisposition contentDisposition = ContentDisposition
                .attachment()
                .filename(download.originalFileName(), StandardCharsets.UTF_8)
                .build();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(download.contentType()))
                .contentLength(download.fileSize())
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                .body(download.resource());
    }
}