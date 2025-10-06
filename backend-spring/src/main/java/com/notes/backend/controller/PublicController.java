package com.notes.backend.controller;

import com.notes.backend.dto.NoteResponse;
import com.notes.backend.model.Note;
import com.notes.backend.service.ShareService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * Contrôleur pour l'accès public aux notes
 */
@RestController
@RequestMapping("/p")
@Tag(name = "Public", description = "API d'accès public aux notes")
public class PublicController {

    @Autowired
    private ShareService shareService;

    @GetMapping("/{urlToken}")
    @Operation(summary = "Accède à une note publique via son token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Note récupérée avec succès"),
        @ApiResponse(responseCode = "404", description = "Note non trouvée ou non publique"),
        @ApiResponse(responseCode = "410", description = "Lien expiré")
    })
    public ResponseEntity<NoteResponse> getPublicNote(
            @Parameter(description = "Token URL de la note publique") @PathVariable String urlToken) {

        Optional<Note> noteOptional = shareService.getPublicNote(urlToken);
        
        if (noteOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Note note = noteOptional.get();
        NoteResponse response = new NoteResponse(note);
        return ResponseEntity.ok(response);
    }
}
