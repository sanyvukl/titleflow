package com.titleflow.lien.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateLienRequest(
        @NotBlank(message = "Lender name is required")
        @Size(max = 255, message = "Lender name must be 255 characters or less")
        String lenderName,

        @NotBlank(message = "Lienholder address is required")
        @Size(max = 255, message = "Lienholder address must be 255 characters or less")
        String lienholderAddress,

        @NotBlank(message = "Loan account number is required")
        @Size(max = 100, message = "Loan account number must be 100 characters or less")
        String loanAccountNumber
) {
}