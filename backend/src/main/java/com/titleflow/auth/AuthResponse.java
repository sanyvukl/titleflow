package com.titleflow.auth;

public record AuthResponse(
        String tokenType,
        String accessToken,
        CurrentUserResponse user
) {
}
