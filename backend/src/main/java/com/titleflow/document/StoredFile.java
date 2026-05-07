package com.titleflow.document;

public record StoredFile(
        String storageKey,
        String originalFileName,
        String contentType,
        Long fileSize
) {
}