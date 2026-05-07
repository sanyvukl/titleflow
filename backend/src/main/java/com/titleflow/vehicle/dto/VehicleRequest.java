package com.titleflow.vehicle.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record VehicleRequest(
        @NotBlank(message = "VIN is required")
        @Size(min = 17, max = 17, message = "VIN must be exactly 17 characters")
        String vin,

        @NotNull(message = "Vehicle year is required")
        @Min(value = 1900, message = "Vehicle year must be 1900 or newer")
        @Max(value = 2100, message = "Vehicle year is invalid")
        Integer year,

        @NotBlank(message = "Make is required")
        @Size(max = 100, message = "Make must be 100 characters or less")
        String make,

        @NotBlank(message = "Model is required")
        @Size(max = 100, message = "Model must be 100 characters or less")
        String model,

        @Size(max = 100, message = "Body type must be 100 characters or less")
        String bodyType,

        @Size(max = 50, message = "Color must be 50 characters or less")
        String color,

        @Min(value = 0, message = "Odometer cannot be negative")
        Long odometer
) {
}