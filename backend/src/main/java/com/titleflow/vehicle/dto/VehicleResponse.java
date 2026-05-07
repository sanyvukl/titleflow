package com.titleflow.vehicle.dto;

public record VehicleResponse(
        Long id,
        String vin,
        Integer year,
        String make,
        String model,
        String bodyType,
        String color,
        Long odometer
) {
}