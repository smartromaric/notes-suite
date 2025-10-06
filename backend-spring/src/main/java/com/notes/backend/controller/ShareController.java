package com.notes.backend.controller;

import com.notes.backend.service.ShareService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Contrôleur pour la gestion des partages
 */
@RestController
@RequestMapping("/shares")
@Tag(name = "Shares", description = "API de gestion des partages")
public class ShareController {

    @Autowired
    private ShareService shareService;

    @DeleteMapping("/{shareId}")
    @Operation(summary = "Supprime un partage")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Partage supprimé avec succès"),
        @ApiResponse(responseCode = "404", description = "Partage non trouvé"),
        @ApiResponse(responseCode = "403", description = "Accès non autorisé")
    })
    public ResponseEntity<Void> deleteShare(
            @Parameter(description = "ID du partage") @PathVariable Long shareId,
            Authentication authentication) {

        String userEmail = authentication.getName();
        shareService.deleteShare(shareId, userEmail);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/public-links/{linkId}")
    @Operation(summary = "Supprime un lien public")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Lien public supprimé avec succès"),
        @ApiResponse(responseCode = "404", description = "Lien public non trouvé"),
        @ApiResponse(responseCode = "403", description = "Accès non autorisé")
    })
    public ResponseEntity<Void> deletePublicLink(
            @Parameter(description = "ID du lien public") @PathVariable Long linkId,
            Authentication authentication) {

        String userEmail = authentication.getName();
        shareService.deletePublicLink(linkId, userEmail);
        return ResponseEntity.noContent().build();
    }
}
