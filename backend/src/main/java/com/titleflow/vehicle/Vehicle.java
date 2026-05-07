package com.titleflow.vehicle;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "vehicles",
        indexes = {
                @Index(name = "idx_vehicles_vin", columnList = "vin")
        }
)
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 17)
    private String vin;

    @Column(name = "vehicle_year", nullable = false)
    private Integer year;

    @Column(nullable = false, length = 100)
    private String make;

    @Column(nullable = false, length = 100)
    private String model;

    @Column(name = "body_type", length = 100)
    private String bodyType;

    @Column(length = 50)
    private String color;

    @Column
    private Long odometer;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected Vehicle() {
    }

    public Vehicle(
            String vin,
            Integer year,
            String make,
            String model,
            String bodyType,
            String color,
            Long odometer
    ) {
        this.vin = vin;
        this.year = year;
        this.make = make;
        this.model = model;
        this.bodyType = bodyType;
        this.color = color;
        this.odometer = odometer;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getVin() {
        return vin;
    }

    public void setVin(String vin) {
        this.vin = vin;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getBodyType() {
        return bodyType;
    }

    public void setBodyType(String bodyType) {
        this.bodyType = bodyType;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Long getOdometer() {
        return odometer;
    }

    public void setOdometer(Long odometer) {
        this.odometer = odometer;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}