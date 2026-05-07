package com.titleflow.auth.dto;

public record AuthResponse(
        String tokenType,
        String accessToken,
        CurrentUserResponse user
) {
}
