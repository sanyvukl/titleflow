package com.titleflow.document.dto;

import com.titleflow.document.DocumentType;

import java.time.LocalDateTime;

public record DocumentResponse(
        Long id,
        Long titleApplicationId,
        String applicationNumber,
        Long uploadedByUserId,
        String uploadedByEmail,
        DocumentType documentType,
        String originalFileName,
        String contentType,
        Long fileSize,
        LocalDateTime uploadedAt
) {
}