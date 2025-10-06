package com.notes.backend.repository;

import com.notes.backend.model.Note;
import com.notes.backend.model.PublicLink;
import com.notes.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité PublicLink
 */
@Repository
public interface PublicLinkRepository extends JpaRepository<PublicLink, Long> {

    /**
     * Trouve un lien public par son token
     */
    Optional<PublicLink> findByUrlToken(String urlToken);

    /**
     * Trouve tous les liens publics d'une note
     */
    List<PublicLink> findByNote(Note note);

    /**
     * Trouve tous les liens publics d'une note par son propriétaire
     */
    @Query("SELECT pl FROM PublicLink pl WHERE pl.note = :note AND pl.note.owner = :owner")
    List<PublicLink> findByNoteAndNoteOwner(@Param("note") Note note, @Param("owner") User owner);

    /**
     * Trouve un lien public par token et vérifie qu'il n'est pas expiré
     */
    @Query("SELECT pl FROM PublicLink pl WHERE pl.urlToken = :urlToken AND (pl.expiresAt IS NULL OR pl.expiresAt > :now)")
    Optional<PublicLink> findByUrlTokenAndNotExpired(@Param("urlToken") String urlToken, @Param("now") LocalDateTime now);

    /**
     * Trouve tous les liens expirés
     */
    @Query("SELECT pl FROM PublicLink pl WHERE pl.expiresAt IS NOT NULL AND pl.expiresAt <= :now")
    List<PublicLink> findExpiredLinks(@Param("now") LocalDateTime now);

    /**
     * Supprime tous les liens publics d'une note
     */
    void deleteByNote(Note note);

    /**
     * Trouve un lien public par ID et vérifie que la note appartient à l'utilisateur
     */
    @Query("SELECT pl FROM PublicLink pl WHERE pl.id = :linkId AND pl.note.owner = :owner")
    Optional<PublicLink> findByIdAndNoteOwner(@Param("linkId") Long linkId, @Param("owner") User owner);

    /**
     * Vérifie si un token existe déjà
     */
    boolean existsByUrlToken(String urlToken);
}
