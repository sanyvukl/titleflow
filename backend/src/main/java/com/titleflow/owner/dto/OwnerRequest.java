package com.titleflow.owner.dto;

import com.titleflow.owner.OwnerType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record OwnerRequest(
        @Size(max = 100, message = "First name must be 100 characters or less")
        String firstName,

        @Size(max = 100, message = "Last name must be 100 characters or less")
        String lastName,

        @Size(max = 255, message = "Business name must be 255 characters or less")
        String businessName,

        @NotBlank(message = "Address line 1 is required")
        @Size(max = 255, message = "Address line 1 must be 255 characters or less")
        String addressLine1,

        @Size(max = 255, message = "Address line 2 must be 255 characters or less")
        String addressLine2,

        @NotBlank(message = "City is required")
        @Size(max = 100, message = "City must be 100 characters or less")
        String city,

        @NotBlank(message = "State is required")
        @Size(min = 2, max = 2, message = "State must be 2 characters")
        String state,

        @NotBlank(message = "ZIP code is required")
        @Size(max = 20, message = "ZIP code must be 20 characters or less")
        String zipCode,

        @Size(max = 30, message = "Phone must be 30 characters or less")
        String phone,

        @Email(message = "Owner email must be valid")
        @Size(max = 255, message = "Email must be 255 characters or less")
        String email,

        @NotNull(message = "Owner type is required")
        OwnerType ownerType
) {
}