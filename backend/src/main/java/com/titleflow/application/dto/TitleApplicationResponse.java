package com.titleflow.application.dto;

import com.titleflow.application.TitleApplicationStatus;
import com.titleflow.owner.dto.OwnerResponse;
import com.titleflow.vehicle.dto.VehicleResponse;

import java.time.LocalDateTime;

public record TitleApplicationResponse(
        Long id,
        String applicationNumber,
        Long dealerId,
        String dealerEmail,
        TitleApplicationStatus status,
        VehicleResponse vehicle,
        OwnerResponse buyerOwner,
        OwnerResponse sellerOwner,
        LocalDateTime submittedAt,
        LocalDateTime reviewedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}