package com.notes.backend.repository;

import com.notes.backend.model.Note;
import com.notes.backend.model.Share;
import com.notes.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité Share
 */
@Repository
public interface ShareRepository extends JpaRepository<Share, Long> {

    /**
     * Trouve tous les partages d'une note
     */
    List<Share> findByNote(Note note);

    /**
     * Trouve tous les partages d'une note par son propriétaire
     */
    @Query("SELECT s FROM Share s WHERE s.note = :note AND s.note.owner = :owner")
    List<Share> findByNoteAndNoteOwner(@Param("note") Note note, @Param("owner") User owner);

    /**
     * Trouve un partage spécifique entre une note et un utilisateur
     */
    Optional<Share> findByNoteAndSharedWithUser(Note note, User sharedWithUser);

    /**
     * Trouve tous les partages reçus par un utilisateur
     */
    List<Share> findBySharedWithUser(User sharedWithUser);

    /**
     * Vérifie si une note est partagée avec un utilisateur
     */
    boolean existsByNoteAndSharedWithUser(Note note, User sharedWithUser);

    /**
     * Trouve toutes les notes partagées avec un utilisateur
     */
    @Query("SELECT s.note FROM Share s WHERE s.sharedWithUser = :user ORDER BY s.note.updatedAt DESC")
    List<Note> findSharedNotesByUser(@Param("user") User user);

    /**
     * Supprime tous les partages d'une note
     */
    void deleteByNote(Note note);

    /**
     * Trouve un partage par ID et vérifie que la note appartient à l'utilisateur
     */
    @Query("SELECT s FROM Share s WHERE s.id = :shareId AND s.note.owner = :owner")
    Optional<Share> findByIdAndNoteOwner(@Param("shareId") Long shareId, @Param("owner") User owner);
}
