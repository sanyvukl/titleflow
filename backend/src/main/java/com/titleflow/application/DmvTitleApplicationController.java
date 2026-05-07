package com.titleflow.application;

import com.titleflow.application.dto.TitleApplicationResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dmv/title-applications")
@PreAuthorize("hasRole('DMV_CLERK')")
public class DmvTitleApplicationController {

    private final TitleApplicationService titleApplicationService;

    public DmvTitleApplicationController(TitleApplicationService titleApplicationService) {
        this.titleApplicationService = titleApplicationService;
    }

    @GetMapping
    public List<TitleApplicationResponse> getApplicationsForReview() {
        return titleApplicationService.getApplicationsForDmvReview();
    }

    @GetMapping("/{id}")
    public TitleApplicationResponse getApplicationForReview(@PathVariable Long id) {
        return titleApplicationService.getApplicationForDmvReview(id);
    }

    @PostMapping("/{id}/start-review")
    public TitleApplicationResponse startReview(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return titleApplicationService.startReview(id, authentication.getName());
    }

    @PostMapping("/{id}/request-more-info")
    public TitleApplicationResponse requestMoreInfo(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return titleApplicationService.requestMoreInfo(id, authentication.getName());
    }

    @PostMapping("/{id}/approve")
    public TitleApplicationResponse approveApplication(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return titleApplicationService.approveApplication(id, authentication.getName());
    }

    @PostMapping("/{id}/reject")
    public TitleApplicationResponse rejectApplication(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return titleApplicationService.rejectApplication(id, authentication.getName());
    }
}