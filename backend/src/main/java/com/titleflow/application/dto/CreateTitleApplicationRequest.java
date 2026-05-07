package com.titleflow.application.dto;

import com.titleflow.owner.dto.OwnerRequest;
import com.titleflow.vehicle.dto.VehicleRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record CreateTitleApplicationRequest(
        @Valid
        @NotNull(message = "Vehicle information is required")
        VehicleRequest vehicle,

        @Valid
        @NotNull(message = "Buyer owner information is required")
        OwnerRequest buyerOwner,

        @Valid
        @NotNull(message = "Seller owner information is required")
        OwnerRequest sellerOwner
) {
}