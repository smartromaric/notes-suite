package com.notes.backend.service;

import com.notes.backend.model.Note;
import com.notes.backend.model.PublicLink;
import com.notes.backend.model.Share;
import com.notes.backend.model.User;
import com.notes.backend.repository.NoteRepository;
import com.notes.backend.repository.PublicLinkRepository;
import com.notes.backend.repository.ShareRepository;
import com.notes.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service pour la gestion du partage des notes
 */
@Service
@Transactional
public class ShareService {

    @Autowired
    private ShareRepository shareRepository;

    @Autowired
    private PublicLinkRepository publicLinkRepository;

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int TOKEN_LENGTH = 32;
    private final SecureRandom random = new SecureRandom();

    /**
     * Partage une note avec un utilisateur
     */
    public void shareNoteWithUser(Long noteId, String userEmail, String ownerEmail) {
        // Vérifier que la note appartient à l'utilisateur
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Note note = noteRepository.findByIdAndOwner(noteId, owner)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        // Vérifier que l'utilisateur avec qui partager existe
        User sharedWithUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Vérifier que ce n'est pas le propriétaire lui-même
        if (owner.getId().equals(sharedWithUser.getId())) {
            throw new RuntimeException("Cannot share note with yourself");
        }

        // Vérifier que la note n'est pas déjà partagée avec cet utilisateur
        if (shareRepository.existsByNoteAndSharedWithUser(note, sharedWithUser)) {
            throw new RuntimeException("Note already shared with this user");
        }

        // Créer le partage
        Share share = new Share(note, sharedWithUser, Share.Permission.READ);
        shareRepository.save(share);

        // Mettre à jour la visibilité de la note
        if (note.getVisibility() == Note.Visibility.PRIVATE) {
            note.setVisibility(Note.Visibility.SHARED);
            noteRepository.save(note);
        }
    }

    /**
     * Crée un lien public pour une note
     */
    public String createPublicLink(Long noteId, String ownerEmail) {
        // Vérifier que la note appartient à l'utilisateur
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Note note = noteRepository.findByIdAndOwner(noteId, owner)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        // Générer un token unique
        String urlToken = generateUniqueToken();

        // Créer le lien public
        PublicLink publicLink = new PublicLink(note, urlToken);
        publicLinkRepository.save(publicLink);

        // Mettre à jour la visibilité de la note
        note.setVisibility(Note.Visibility.PUBLIC);
        noteRepository.save(note);

        return urlToken;
    }

    /**
     * Supprime un partage
     */
    public void deleteShare(Long shareId, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Share share = shareRepository.findByIdAndNoteOwner(shareId, owner)
                .orElseThrow(() -> new RuntimeException("Share not found"));

        shareRepository.delete(share);

        // Vérifier si la note a encore des partages
        List<Share> remainingShares = shareRepository.findByNote(share.getNote());
        if (remainingShares.isEmpty()) {
            // Si plus de partages, remettre la visibilité à PRIVATE
            Note note = share.getNote();
            note.setVisibility(Note.Visibility.PRIVATE);
            noteRepository.save(note);
        }
    }

    /**
     * Supprime un lien public
     */
    public void deletePublicLink(Long linkId, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        PublicLink publicLink = publicLinkRepository.findByIdAndNoteOwner(linkId, owner)
                .orElseThrow(() -> new RuntimeException("Public link not found"));

        publicLinkRepository.delete(publicLink);

        // Vérifier si la note a encore des liens publics
        List<PublicLink> remainingLinks = publicLinkRepository.findByNote(publicLink.getNote());
        if (remainingLinks.isEmpty()) {
            // Si plus de liens publics, remettre la visibilité à SHARED ou PRIVATE
            Note note = publicLink.getNote();
            List<Share> shares = shareRepository.findByNote(note);
            note.setVisibility(shares.isEmpty() ? Note.Visibility.PRIVATE : Note.Visibility.SHARED);
            noteRepository.save(note);
        }
    }

    /**
     * Récupère une note publique par son token
     */
    @Transactional(readOnly = true)
    public Optional<Note> getPublicNote(String urlToken) {
        return publicLinkRepository.findByUrlTokenAndNotExpired(urlToken, LocalDateTime.now())
                .map(PublicLink::getNote);
    }

    /**
     * Génère un token unique
     */
    private String generateUniqueToken() {
        String token;
        do {
            StringBuilder sb = new StringBuilder(TOKEN_LENGTH);
            for (int i = 0; i < TOKEN_LENGTH; i++) {
                sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
            }
            token = sb.toString();
        } while (publicLinkRepository.existsByUrlToken(token));

        return token;
    }
}
