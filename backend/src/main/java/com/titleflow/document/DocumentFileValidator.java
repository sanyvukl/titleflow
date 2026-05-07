package com.titleflow.document;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.Locale;

@Service
public class DocumentFileValidator {

    private final DocumentStorageProperties properties;

    public DocumentFileValidator(DocumentStorageProperties properties) {
        this.properties = properties;
    }

    public void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }

        if (file.getSize() > properties.getMaxFileSizeBytes()) {
            throw new IllegalArgumentException("File size cannot exceed 10 MB");
        }

        String originalFileName = StringUtils.cleanPath(
                file.getOriginalFilename() == null ? "" : file.getOriginalFilename()
        );

        if (originalFileName.isBlank()) {
            throw new IllegalArgumentException("File name is required");
        }

        if (originalFileName.contains("..")) {
            throw new IllegalArgumentException("Invalid file name");
        }

        String extension = extractExtension(originalFileName);

        if (!isAllowedExtension(extension)) {
            throw new IllegalArgumentException("File extension is not allowed");
        }

        String contentType = file.getContentType();

        if (contentType == null || !isAllowedContentType(contentType)) {
            throw new IllegalArgumentException("File content type is not allowed");
        }
    }

    private String extractExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf(".");

        if (lastDotIndex == -1) {
            return "";
        }

        return fileName.substring(lastDotIndex).toLowerCase(Locale.ROOT);
    }

    private boolean isAllowedExtension(String extension) {
        return properties.getAllowedExtensions()
                .stream()
                .map(value -> value.toLowerCase(Locale.ROOT))
                .anyMatch(value -> value.equals(extension));
    }

    private boolean isAllowedContentType(String contentType) {
        String normalizedContentType = contentType.toLowerCase(Locale.ROOT);

        return properties.getAllowedContentTypes()
                .stream()
                .map(value -> value.toLowerCase(Locale.ROOT))
                .anyMatch(value -> value.equals(normalizedContentType));
    }
}