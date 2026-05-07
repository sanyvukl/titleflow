package com.titleflow.owner.dto;

import com.titleflow.owner.OwnerType;

public record OwnerResponse(
        Long id,
        String firstName,
        String lastName,
        String businessName,
        String addressLine1,
        String addressLine2,
        String city,
        String state,
        String zipCode,
        String phone,
        String email,
        OwnerType ownerType
) {
}