package com.titleflow.auth;

import com.titleflow.user.RoleName;
import com.titleflow.user.UserStatus;

import java.util.Set;

public record CurrentUserResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        UserStatus status,
        Set<RoleName> roles
) {
}
