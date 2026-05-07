package com.titleflow.document;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalStorageService implements StorageService {

    private final Path uploadRootPath;

    public LocalStorageService(DocumentStorageProperties properties) {
        this.uploadRootPath = Paths.get(properties.getLocalRoot()).toAbsolutePath().normalize();
        createUploadDirectoryIfMissing();
    }

    @Override
    public StoredFile store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }

        String originalFileName = StringUtils.cleanPath(
                file.getOriginalFilename() == null ? "unknown-file" : file.getOriginalFilename()
        );

        if (originalFileName.contains("..")) {
            throw new IllegalArgumentException("Invalid file name");
        }

        String contentType = file.getContentType() == null
                ? "application/octet-stream"
                : file.getContentType();

        String fileExtension = extractFileExtension(originalFileName);
        String storageFileName = UUID.randomUUID() + fileExtension;

        Path targetLocation = uploadRootPath.resolve(storageFileName).normalize();

        if (!targetLocation.startsWith(uploadRootPath)) {
            throw new IllegalArgumentException("Invalid storage path");
        }

        try {
            Files.copy(
                    file.getInputStream(),
                    targetLocation,
                    StandardCopyOption.REPLACE_EXISTING
            );
        } catch (IOException ex) {
            throw new IllegalStateException("Could not store file", ex);
        }

        return new StoredFile(
                storageFileName,
                originalFileName,
                contentType,
                file.getSize()
        );
    }

    @Override
    public Resource loadAsResource(String storageKey) {
        try {
            Path filePath = uploadRootPath.resolve(storageKey).normalize();

            if (!filePath.startsWith(uploadRootPath)) {
                throw new IllegalArgumentException("Invalid storage key");
            }

            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new IllegalArgumentException("File not found or not readable");
            }

            return resource;
        } catch (MalformedURLException ex) {
            throw new IllegalArgumentException("Invalid file path", ex);
        }
    }

    @Override
    public void delete(String storageKey) {
        try {
            Path filePath = uploadRootPath.resolve(storageKey).normalize();

            if (!filePath.startsWith(uploadRootPath)) {
                throw new IllegalArgumentException("Invalid storage key");
            }

            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new IllegalStateException("Could not delete file", ex);
        }
    }

    private void createUploadDirectoryIfMissing() {
        try {
            Files.createDirectories(uploadRootPath);
        } catch (IOException ex) {
            throw new IllegalStateException("Could not create upload directory", ex);
        }
    }

    private String extractFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf(".");

        if (lastDotIndex == -1) {
            return "";
        }

        return fileName.substring(lastDotIndex);
    }
}