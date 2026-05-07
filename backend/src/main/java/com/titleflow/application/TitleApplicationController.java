package com.titleflow.application;

import com.titleflow.application.dto.CreateTitleApplicationRequest;
import com.titleflow.application.dto.TitleApplicationResponse;
import com.titleflow.application.dto.UpdateTitleApplicationRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/title-applications")
public class TitleApplicationController {

    private final TitleApplicationService titleApplicationService;

    public TitleApplicationController(TitleApplicationService titleApplicationService) {
        this.titleApplicationService = titleApplicationService;
    }

    @PreAuthorize("hasRole('DEALER')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TitleApplicationResponse createDraft(
            @Valid @RequestBody CreateTitleApplicationRequest request,
            Authentication authentication
    ) {
        return titleApplicationService.createDraft(request, authentication.getName());
    }

    @PreAuthorize("hasRole('DEALER')")
    @GetMapping
    public List<TitleApplicationResponse> getMyApplications(Authentication authentication) {
        return titleApplicationService.getMyApplications(authentication.getName());
    }

    @PreAuthorize("hasRole('DEALER')")
    @GetMapping("/{id}")
    public TitleApplicationResponse getMyApplicationById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return titleApplicationService.getMyApplicationById(id, authentication.getName());
    }

    @PreAuthorize("hasRole('DEALER')")
    @PutMapping("/{id}")
    public TitleApplicationResponse updateDraft(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTitleApplicationRequest request,
            Authentication authentication
    ) {
        return titleApplicationService.updateDraft(id, request, authentication.getName());
    }

    @PreAuthorize("hasRole('DEALER')")
    @PostMapping("/{id}/submit")
    public TitleApplicationResponse submitApplication(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return titleApplicationService.submitApplication(id, authentication.getName());
    }
}