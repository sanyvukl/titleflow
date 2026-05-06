package com.titleflow.exception;

import java.time.Instant;
import java.util.Map;

public record ApiError(
        int status,
        String error,
        String message,
        String path,
        Instant timestamp,
        Map<String, String> validationErrors
) {
    public static ApiError of(int status, String error, String message, String path) {
        return new ApiError(
                status,
                error,
                message,
                path,
                Instant.now(),
                Map.of()
        );
    }

    public static ApiError withValidationErrors(
            int status,
            String error,
            String message,
            String path,
            Map<String, String> validationErrors
    ) {
        return new ApiError(
                status,
                error,
                message,
                path,
                Instant.now(),
                validationErrors
        );
    }
}