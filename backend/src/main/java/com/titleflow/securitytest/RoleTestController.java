package com.titleflow.securitytest;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class RoleTestController {

    @GetMapping("/authenticated")
    public Map<String, Object> authenticated(Authentication authentication) {
        return Map.of(
                "message", "Authenticated access granted",
                "user", authentication.getName(),
                "authorities", authentication.getAuthorities()
        );
    }

    @PreAuthorize("hasRole('DEALER')")
    @GetMapping("/dealer")
    public Map<String, String> dealerOnly() {
        return Map.of("message", "Dealer access granted");
    }

    @PreAuthorize("hasRole('DMV_CLERK')")
    @GetMapping("/dmv")
    public Map<String, String> dmvOnly() {
        return Map.of("message", "DMV clerk access granted");
    }

    @PreAuthorize("hasRole('LENDER')")
    @GetMapping("/lender")
    public Map<String, String> lenderOnly() {
        return Map.of("message", "Lender access granted");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public Map<String, String> adminOnly() {
        return Map.of("message", "Admin access granted");
    }

    @PreAuthorize("hasRole('DEVELOPER')")
    @GetMapping("/developer")
    public Map<String, String> developerOnly() {
        return Map.of("message", "Developer access granted");
    }
}