package com.titleflow.vehicle;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByVinIgnoreCase(String vin);
}