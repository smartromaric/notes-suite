package com.notes.backend.controller;

import com.notes.backend.dto.NoteRequest;
import com.notes.backend.dto.NoteResponse;
import com.notes.backend.model.Note;
import com.notes.backend.service.NoteService;
import com.notes.backend.service.ShareService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Contrôleur pour la gestion des notes
 */
@RestController
@RequestMapping("/notes")
@Tag(name = "Notes", description = "API de gestion des notes")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @Autowired
    private ShareService shareService;

    @GetMapping
    @Operation(summary = "Récupère les notes de l'utilisateur avec pagination et filtres")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Notes récupérées avec succès"),
        @ApiResponse(responseCode = "401", description = "Non authentifié")
    })
    public ResponseEntity<Page<NoteResponse>> getUserNotes(
            @Parameter(description = "Terme de recherche dans le titre") @RequestParam(required = false) String query,
            @Parameter(description = "Filtre par tag") @RequestParam(required = false) String tag,
            @Parameter(description = "Filtre par visibilité") @RequestParam(required = false) Note.Visibility visibility,
            @Parameter(description = "Numéro de page (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Taille de la page") @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        String userEmail = authentication.getName();
        Page<NoteResponse> notes = noteService.getUserNotes(userEmail, query, tag, visibility, page, size);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupère une note par son ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Note récupérée avec succès"),
        @ApiResponse(responseCode = "404", description = "Note non trouvée"),
        @ApiResponse(responseCode = "403", description = "Accès non autorisé")
    })
    public ResponseEntity<NoteResponse> getNoteById(
            @Parameter(description = "ID de la note") @PathVariable Long id,
            Authentication authentication) {

        String userEmail = authentication.getName();
        NoteResponse note = noteService.getNoteById(id, userEmail);
        return ResponseEntity.ok(note);
    }

    @PostMapping
    @Operation(summary = "Crée une nouvelle note")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Note créée avec succès"),
        @ApiResponse(responseCode = "400", description = "Données invalides"),
        @ApiResponse(responseCode = "401", description = "Non authentifié")
    })
    public ResponseEntity<NoteResponse> createNote(
            @Valid @RequestBody NoteRequest request,
            Authentication authentication) {

        String userEmail = authentication.getName();
        NoteResponse note = noteService.createNote(request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(note);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Met à jour une note")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Note mise à jour avec succès"),
        @ApiResponse(responseCode = "404", description = "Note non trouvée"),
        @ApiResponse(responseCode = "403", description = "Accès non autorisé"),
        @ApiResponse(responseCode = "400", description = "Données invalides")
    })
    public ResponseEntity<NoteResponse> updateNote(
            @Parameter(description = "ID de la note") @PathVariable Long id,
            @Valid @RequestBody NoteRequest request,
            Authentication authentication) {

        String userEmail = authentication.getName();
        NoteResponse note = noteService.updateNote(id, request, userEmail);
        return ResponseEntity.ok(note);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprime une note")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Note supprimée avec succès"),
        @ApiResponse(responseCode = "404", description = "Note non trouvée"),
        @ApiResponse(responseCode = "403", description = "Accès non autorisé")
    })
    public ResponseEntity<Void> deleteNote(
            @Parameter(description = "ID de la note") @PathVariable Long id,
            Authentication authentication) {

        String userEmail = authentication.getName();
        noteService.deleteNote(id, userEmail);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/share/user")
    @Operation(summary = "Partage une note avec un utilisateur")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Note partagée avec succès"),
        @ApiResponse(responseCode = "404", description = "Note ou utilisateur non trouvé"),
        @ApiResponse(responseCode = "403", description = "Accès non autorisé")
    })
    public ResponseEntity<String> shareNoteWithUser(
            @Parameter(description = "ID de la note") @PathVariable Long id,
            @Parameter(description = "Email de l'utilisateur") @RequestParam String email,
            Authentication authentication) {

        String userEmail = authentication.getName();
        shareService.shareNoteWithUser(id, email, userEmail);
        return ResponseEntity.ok("Note shared successfully");
    }

    @PostMapping("/{id}/share/public")
    @Operation(summary = "Crée un lien public pour une note")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lien public créé avec succès"),
        @ApiResponse(responseCode = "404", description = "Note non trouvée"),
        @ApiResponse(responseCode = "403", description = "Accès non autorisé")
    })
    public ResponseEntity<String> createPublicLink(
            @Parameter(description = "ID de la note") @PathVariable Long id,
            Authentication authentication) {

        String userEmail = authentication.getName();
        String publicUrl = shareService.createPublicLink(id, userEmail);
        return ResponseEntity.ok(publicUrl);
    }
}
