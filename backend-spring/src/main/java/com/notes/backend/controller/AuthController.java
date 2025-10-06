package com.notes.backend.controller;

import com.notes.backend.dto.AuthResponse;
import com.notes.backend.dto.LoginRequest;
import com.notes.backend.dto.RegisterRequest;
import com.notes.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Contrôleur pour l'authentification
 */
@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "API d'authentification")
public class AuthController {

    @Autowired
    private AuthService authService;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("API is working!");
    }

    @PostMapping("/register")
    @Operation(summary = "Inscription d'un nouvel utilisateur")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Utilisateur créé avec succès"),
        @ApiResponse(responseCode = "400", description = "Données invalides"),
        @ApiResponse(responseCode = "409", description = "Email déjà utilisé")
    })
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            if ("Email already exists".equals(e.getMessage())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    @Operation(summary = "Connexion d'un utilisateur")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Connexion réussie"),
        @ApiResponse(responseCode = "401", description = "Identifiants invalides"),
        @ApiResponse(responseCode = "400", description = "Données invalides")
    })
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            if ("Invalid email or password".equals(e.getMessage())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/refresh")
    @Operation(summary = "Rafraîchir le token d'accès")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Token rafraîchi avec succès"),
        @ApiResponse(responseCode = "401", description = "Refresh token invalide")
    })
    public ResponseEntity<AuthResponse> refreshToken(@RequestHeader("Authorization") String authorization) {
        try {
            String refreshToken = authorization.substring(7); // Remove "Bearer "
            AuthResponse response = authService.refreshToken(refreshToken);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
