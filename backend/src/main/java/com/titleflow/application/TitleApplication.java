package com.titleflow.application;

import com.titleflow.owner.Owner;
import com.titleflow.user.User;
import com.titleflow.vehicle.Vehicle;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "title_applications",
        indexes = {
                @Index(name = "idx_title_applications_application_number", columnList = "application_number"),
                @Index(name = "idx_title_applications_status", columnList = "status")
        }
)
public class TitleApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_number", nullable = false, unique = true, length = 50)
    private String applicationNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "dealer_id", nullable = false)
    private User dealer;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "buyer_owner_id", nullable = false)
    private Owner buyerOwner;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "seller_owner_id", nullable = false)
    private Owner sellerOwner;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private TitleApplicationStatus status = TitleApplicationStatus.DRAFT;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected TitleApplication() {
    }

    public TitleApplication(
            String applicationNumber,
            User dealer,
            Vehicle vehicle,
            Owner buyerOwner,
            Owner sellerOwner
    ) {
        this.applicationNumber = applicationNumber;
        this.dealer = dealer;
        this.vehicle = vehicle;
        this.buyerOwner = buyerOwner;
        this.sellerOwner = sellerOwner;
        this.status = TitleApplicationStatus.DRAFT;
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

    public void submit() {
        if (this.status != TitleApplicationStatus.DRAFT
                && this.status != TitleApplicationStatus.NEEDS_MORE_INFO) {
            throw new IllegalArgumentException(
                    "Only DRAFT or NEEDS_MORE_INFO applications can be submitted"
            );
        }

        this.status = TitleApplicationStatus.SUBMITTED;
        this.submittedAt = LocalDateTime.now();
    }

    public void startReview() {
        requireStatus(
                TitleApplicationStatus.SUBMITTED,
                "Only submitted applications can be moved under review"
        );

        this.status = TitleApplicationStatus.UNDER_REVIEW;
    }

    public void requestMoreInfo() {
        requireStatus(
                TitleApplicationStatus.UNDER_REVIEW,
                "Only applications under review can request more information"
        );

        this.status = TitleApplicationStatus.NEEDS_MORE_INFO;
    }

    public void approve() {
        requireStatus(
                TitleApplicationStatus.UNDER_REVIEW,
                "Only applications under review can be approved"
        );

        this.status = TitleApplicationStatus.APPROVED;
        this.reviewedAt = LocalDateTime.now();
    }

    public void reject() {
        requireStatus(
                TitleApplicationStatus.UNDER_REVIEW,
                "Only applications under review can be rejected"
        );

        this.status = TitleApplicationStatus.REJECTED;
        this.reviewedAt = LocalDateTime.now();
    }

    public boolean isDraft() {
        return this.status == TitleApplicationStatus.DRAFT;
    }

    public boolean canDealerModify() {
        return this.status == TitleApplicationStatus.DRAFT
                || this.status == TitleApplicationStatus.NEEDS_MORE_INFO;
    }

    public boolean isSubmitted() {
        return this.status == TitleApplicationStatus.SUBMITTED;
    }

    public boolean isUnderReview() {
        return this.status == TitleApplicationStatus.UNDER_REVIEW;
    }

    private void requireStatus(
            TitleApplicationStatus requiredStatus,
            String message
    ) {
        if (this.status != requiredStatus) {
            throw new IllegalArgumentException(message);
        }
    }

    public boolean belongsToDealer(Long dealerId) {
        return this.dealer != null && this.dealer.getId().equals(dealerId);
    }

    public Long getId() {
        return id;
    }

    public String getApplicationNumber() {
        return applicationNumber;
    }

    public void setApplicationNumber(String applicationNumber) {
        this.applicationNumber = applicationNumber;
    }

    public User getDealer() {
        return dealer;
    }

    public void setDealer(User dealer) {
        this.dealer = dealer;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public Owner getBuyerOwner() {
        return buyerOwner;
    }

    public void setBuyerOwner(Owner buyerOwner) {
        this.buyerOwner = buyerOwner;
    }

    public Owner getSellerOwner() {
        return sellerOwner;
    }

    public void setSellerOwner(Owner sellerOwner) {
        this.sellerOwner = sellerOwner;
    }

    public TitleApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(TitleApplicationStatus status) {
        this.status = status;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}