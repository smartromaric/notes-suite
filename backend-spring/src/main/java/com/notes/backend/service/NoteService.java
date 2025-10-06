package com.notes.backend.service;

import com.notes.backend.dto.NoteRequest;
import com.notes.backend.dto.NoteResponse;
import com.notes.backend.model.Note;
import com.notes.backend.model.NoteTag;
import com.notes.backend.model.Tag;
import com.notes.backend.model.User;
import com.notes.backend.repository.NoteRepository;
import com.notes.backend.repository.TagRepository;
import com.notes.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Service pour la gestion des notes
 */
@Service
@Transactional
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Récupère toutes les notes d'un utilisateur avec pagination et filtres
     */
    @Transactional(readOnly = true)
    public Page<NoteResponse> getUserNotes(String userEmail, String query, String tagLabel, 
                                         Note.Visibility visibility, int page, int size) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"));
        
        Page<Note> notes = noteRepository.findByUserWithFilters(
                user, query, visibility, tagLabel, pageable);

        return notes.map(NoteResponse::new);
    }

    /**
     * Récupère une note par son ID
     */
    @Transactional(readOnly = true)
    public NoteResponse getNoteById(Long noteId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Note note = noteRepository.findByIdAndUserAccess(noteId, user)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        return new NoteResponse(note);
    }

    /**
     * Crée une nouvelle note
     */
    public NoteResponse createNote(NoteRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Note note = new Note();
        note.setOwner(user);
        note.setTitle(request.getTitle());
        note.setContentMd(request.getContentMd());
        note.setVisibility(request.getVisibility() != null ? request.getVisibility() : Note.Visibility.PRIVATE);

        // Sauvegarder d'abord la note sans les tags
        Note savedNote = noteRepository.save(note);

        // Gérer les tags après que la note soit persistée
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            for (String tagLabel : request.getTags()) {
                Tag tag = getOrCreateTag(tagLabel);
                // Créer directement le NoteTag et l'ajouter à la note
                NoteTag noteTag = new NoteTag(savedNote, tag);
                savedNote.getNoteTags().add(noteTag);
            }
            // Sauvegarder à nouveau avec les tags
            savedNote = noteRepository.save(savedNote);
        }

        return new NoteResponse(savedNote);
    }

    /**
     * Met à jour une note
     */
    public NoteResponse updateNote(Long noteId, NoteRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Note note = noteRepository.findByIdAndOwner(noteId, user)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        // Mettre à jour les champs
        note.setTitle(request.getTitle());
        note.setContentMd(request.getContentMd());
        if (request.getVisibility() != null) {
            note.setVisibility(request.getVisibility());
        }

        // Gérer les tags
        if (request.getTags() != null) {
            // Supprimer tous les tags existants
            note.getNoteTags().clear();
            
            // Ajouter les nouveaux tags
            for (String tagLabel : request.getTags()) {
                Tag tag = getOrCreateTag(tagLabel);
                // Créer directement le NoteTag et l'ajouter à la note
                NoteTag noteTag = new NoteTag(note, tag);
                note.getNoteTags().add(noteTag);
            }
        }

        Note savedNote = noteRepository.save(note);
        return new NoteResponse(savedNote);
    }

    /**
     * Supprime une note
     */
    public void deleteNote(Long noteId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!noteRepository.existsByIdAndOwner(noteId, user)) {
            throw new RuntimeException("Note not found");
        }

        noteRepository.deleteById(noteId);
    }

    /**
     * Récupère une note publique par son token
     */
    @Transactional(readOnly = true)
    public NoteResponse getPublicNote(String urlToken) {
        // Cette méthode sera implémentée via le ShareService
        throw new RuntimeException("Use ShareService.getPublicNote instead");
    }

    /**
     * Récupère ou crée un tag
     */
    private Tag getOrCreateTag(String label) {
        return tagRepository.findByLabelIgnoreCase(label)
                .orElseGet(() -> {
                    Tag newTag = new Tag(label);
                    return tagRepository.save(newTag);
                });
    }

    /**
     * Récupère les notes partagées avec un utilisateur
     */
    @Transactional(readOnly = true)
    public Page<NoteResponse> getSharedNotes(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"));
        List<Note> sharedNotes = noteRepository.findSharedWithUser(user);
        
        // Convertir en Page (simulation)
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), sharedNotes.size());
        List<Note> pageContent = sharedNotes.subList(start, end);
        
        Page<Note> notes = new PageImpl<>(pageContent, pageable, sharedNotes.size());
        return notes.map(NoteResponse::new);
    }
}
