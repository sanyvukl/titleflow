package com.titleflow.document;

import org.springframework.core.io.Resource;

public record DocumentDownload(
        Resource resource,
        String originalFileName,
        String contentType,
        Long fileSize
) {
}