package com.notes.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Contrôleur pour la page d'accueil
 */
@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
            "message", "Notes Backend API",
            "version", "1.0.0",
            "status", "running",
            "endpoints", Map.of(
                "auth", "/api/v1/auth/**",
                "notes", "/api/v1/notes/**",
                "public", "/api/v1/p/**",
                "swagger", "/swagger-ui.html",
                "h2-console", "/h2-console"
            )
        );
    }
}
