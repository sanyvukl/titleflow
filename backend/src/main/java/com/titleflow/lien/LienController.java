package com.titleflow.lien;

import com.titleflow.lien.dto.CreateLienRequest;
import com.titleflow.lien.dto.LienResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class LienController {

    private final LienService lienService;

    public LienController(LienService lienService) {
        this.lienService = lienService;
    }

    @PreAuthorize("hasRole('LENDER')")
    @PostMapping("/api/title-applications/{applicationId}/liens")
    @ResponseStatus(HttpStatus.CREATED)
    public LienResponse createLien(
            @PathVariable Long applicationId,
            @Valid @RequestBody CreateLienRequest request,
            Authentication authentication
    ) {
        return lienService.createLien(
                applicationId,
                request,
                authentication.getName()
        );
    }

    @PreAuthorize("hasAnyRole('DEALER', 'DMV_CLERK', 'LENDER', 'ADMIN')")
    @GetMapping("/api/title-applications/{applicationId}/liens")
    public List<LienResponse> getLiensForApplication(
            @PathVariable Long applicationId,
            Authentication authentication
    ) {
        return lienService.getLiensForApplication(
                applicationId,
                authentication.getName()
        );
    }

    @PreAuthorize("hasRole('LENDER')")
    @GetMapping("/api/lender/liens")
    public List<LienResponse> getMyLiens(Authentication authentication) {
        return lienService.getMyLiens(authentication.getName());
    }

    @PreAuthorize("hasRole('LENDER')")
    @PostMapping("/api/title-applications/{applicationId}/liens/{lienId}/release")
    public LienResponse releaseLien(
            @PathVariable Long applicationId,
            @PathVariable Long lienId,
            Authentication authentication
    ) {
        return lienService.releaseLien(
                applicationId,
                lienId,
                authentication.getName()
        );
    }
}