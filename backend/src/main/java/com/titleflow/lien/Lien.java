package com.titleflow.lien;

import com.titleflow.application.TitleApplication;
import com.titleflow.user.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "liens",
        indexes = {
                @Index(name = "idx_liens_title_application_id", columnList = "title_application_id"),
                @Index(name = "idx_liens_lender_user_id", columnList = "lender_user_id"),
                @Index(name = "idx_liens_status", columnList = "status")
        }
)
public class Lien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "title_application_id", nullable = false)
    private TitleApplication titleApplication;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lender_user_id", nullable = false)
    private User lender;

    @Column(name = "lender_name", nullable = false, length = 255)
    private String lenderName;

    @Column(name = "lienholder_address", nullable = false, length = 255)
    private String lienholderAddress;

    @Column(name = "loan_account_number", nullable = false, length = 100)
    private String loanAccountNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private LienStatus status = LienStatus.ACTIVE;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "released_at")
    private LocalDateTime releasedAt;

    protected Lien() {
    }

    public Lien(
            TitleApplication titleApplication,
            User lender,
            String lenderName,
            String lienholderAddress,
            String loanAccountNumber
    ) {
        this.titleApplication = titleApplication;
        this.lender = lender;
        this.lenderName = lenderName;
        this.lienholderAddress = lienholderAddress;
        this.loanAccountNumber = loanAccountNumber;
        this.status = LienStatus.ACTIVE;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public void release() {
        if (this.status != LienStatus.ACTIVE) {
            throw new IllegalArgumentException("Only active liens can be released");
        }

        this.status = LienStatus.RELEASED;
        this.releasedAt = LocalDateTime.now();
    }

    public boolean isActive() {
        return this.status == LienStatus.ACTIVE;
    }

    public Long getId() {
        return id;
    }

    public TitleApplication getTitleApplication() {
        return titleApplication;
    }

    public User getLender() {
        return lender;
    }

    public String getLenderName() {
        return lenderName;
    }

    public String getLienholderAddress() {
        return lienholderAddress;
    }

    public String getLoanAccountNumber() {
        return loanAccountNumber;
    }

    public LienStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getReleasedAt() {
        return releasedAt;
    }
}