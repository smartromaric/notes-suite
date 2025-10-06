package com.notes.backend.repository;

import com.notes.backend.model.Note;
import com.notes.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité Note
 */
@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    /**
     * Trouve toutes les notes d'un utilisateur avec pagination
     */
    Page<Note> findByOwnerOrderByUpdatedAtDesc(User owner, Pageable pageable);

    /**
     * Trouve toutes les notes d'un utilisateur
     */
    List<Note> findByOwnerOrderByUpdatedAtDesc(User owner);

    /**
     * Recherche des notes par titre (insensible à la casse)
     */
    @Query("SELECT n FROM Note n WHERE n.owner = :owner AND LOWER(n.title) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY n.updatedAt DESC")
    Page<Note> findByOwnerAndTitleContainingIgnoreCase(@Param("owner") User owner, @Param("query") String query, Pageable pageable);

    /**
     * Trouve des notes par visibilité
     */
    @Query("SELECT n FROM Note n WHERE n.owner = :owner AND n.visibility = :visibility ORDER BY n.updatedAt DESC")
    Page<Note> findByOwnerAndVisibility(@Param("owner") User owner, @Param("visibility") Note.Visibility visibility, Pageable pageable);

    /**
     * Trouve des notes par tag
     */
    @Query("SELECT DISTINCT n FROM Note n JOIN n.noteTags nt JOIN nt.tag t WHERE n.owner = :owner AND t.label = :tagLabel ORDER BY n.updatedAt DESC")
    Page<Note> findByOwnerAndTagLabel(@Param("owner") User owner, @Param("tagLabel") String tagLabel, Pageable pageable);

    /**
     * Recherche combinée (titre + visibilité + tag) - Notes personnelles uniquement
     */
    @Query("SELECT DISTINCT n FROM Note n LEFT JOIN n.noteTags nt LEFT JOIN nt.tag t " +
           "WHERE n.owner = :owner " +
           "AND (:query IS NULL OR LOWER(n.title) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:visibility IS NULL OR n.visibility = :visibility) " +
           "AND (:tagLabel IS NULL OR t.label = :tagLabel) " +
           "ORDER BY n.updatedAt DESC")
    Page<Note> findByOwnerWithFilters(@Param("owner") User owner, 
                                     @Param("query") String query, 
                                     @Param("visibility") Note.Visibility visibility, 
                                     @Param("tagLabel") String tagLabel, 
                                     Pageable pageable);

    /**
     * Recherche combinée (titre + visibilité + tag) - Notes personnelles + partagées
     */
    @Query("SELECT DISTINCT n FROM Note n LEFT JOIN n.noteTags nt LEFT JOIN nt.tag t " +
           "LEFT JOIN Share s ON s.note = n AND s.sharedWithUser = :user " +
           "WHERE (n.owner = :user OR s.sharedWithUser = :user) " +
           "AND (:query IS NULL OR LOWER(n.title) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:visibility IS NULL OR n.visibility = :visibility) " +
           "AND (:tagLabel IS NULL OR t.label = :tagLabel) " +
           "ORDER BY n.updatedAt DESC")
    Page<Note> findByUserWithFilters(@Param("user") User user, 
                                    @Param("query") String query, 
                                    @Param("visibility") Note.Visibility visibility, 
                                    @Param("tagLabel") String tagLabel, 
                                    Pageable pageable);

    /**
     * Trouve une note par ID et propriétaire
     */
    Optional<Note> findByIdAndOwner(Long id, User owner);

    /**
     * Trouve une note par ID avec accès (propriétaire ou partagée)
     */
    @Query("SELECT n FROM Note n LEFT JOIN Share s ON s.note = n AND s.sharedWithUser = :user " +
           "WHERE n.id = :noteId AND (n.owner = :user OR s.sharedWithUser = :user)")
    Optional<Note> findByIdAndUserAccess(@Param("noteId") Long noteId, @Param("user") User user);

    /**
     * Trouve des notes partagées avec un utilisateur
     */
    @Query("SELECT s.note FROM Share s WHERE s.sharedWithUser = :user ORDER BY s.note.updatedAt DESC")
    List<Note> findSharedWithUser(@Param("user") User user);

    /**
     * Trouve des notes partagées avec un utilisateur avec pagination
     */
    @Query("SELECT s.note FROM Share s WHERE s.sharedWithUser = :user ORDER BY s.note.updatedAt DESC")
    Page<Note> findSharedWithUser(@Param("user") User user, Pageable pageable);

    /**
     * Trouve des notes publiques
     */
    @Query("SELECT n FROM Note n WHERE n.visibility = 'PUBLIC' ORDER BY n.updatedAt DESC")
    Page<Note> findPublicNotes(Pageable pageable);

    /**
     * Vérifie si une note appartient à un utilisateur
     */
    boolean existsByIdAndOwner(Long id, User owner);

    // Note: findByPublicLink sera géré via PublicLinkRepository
}
