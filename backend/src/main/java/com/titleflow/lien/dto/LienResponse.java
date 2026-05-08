package com.titleflow.lien.dto;

import com.titleflow.lien.LienStatus;

import java.time.LocalDateTime;

public record LienResponse(
        Long id,
        Long titleApplicationId,
        String applicationNumber,
        Long lenderUserId,
        String lenderEmail,
        String lenderName,
        String lienholderAddress,
        String loanAccountNumber,
        LienStatus status,
        LocalDateTime createdAt,
        LocalDateTime releasedAt
) {
}