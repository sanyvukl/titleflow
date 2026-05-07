package com.titleflow.document;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@ConfigurationProperties(prefix = "app.document-storage")
public class DocumentStorageProperties {

    private String localRoot = "uploaded-documents";

    private long maxFileSizeBytes = 10 * 1024 * 1024;

    private Set<String> allowedContentTypes = new HashSet<>(
            Set.of("application/pdf", "image/png", "image/jpeg")
    );

    private Set<String> allowedExtensions = new HashSet<>(
            Set.of(".pdf", ".png", ".jpg", ".jpeg")
    );

    public String getLocalRoot() {
        return localRoot;
    }

    public void setLocalRoot(String localRoot) {
        this.localRoot = localRoot;
    }

    public long getMaxFileSizeBytes() {
        return maxFileSizeBytes;
    }

    public void setMaxFileSizeBytes(long maxFileSizeBytes) {
        this.maxFileSizeBytes = maxFileSizeBytes;
    }

    public Set<String> getAllowedContentTypes() {
        return allowedContentTypes;
    }

    public void setAllowedContentTypes(Set<String> allowedContentTypes) {
        this.allowedContentTypes = allowedContentTypes;
    }

    public Set<String> getAllowedExtensions() {
        return allowedExtensions;
    }

    public void setAllowedExtensions(Set<String> allowedExtensions) {
        this.allowedExtensions = allowedExtensions;
    }
}