package com.notes.backend.model;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Entité Share représentant le partage d'une note avec un utilisateur
 */
@Entity
@Table(name = "shares")
@EntityListeners(AuditingEntityListener.class)
public class Share {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "note_id", nullable = false)
    private Note note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shared_with_user_id", nullable = false)
    private User sharedWithUser;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Permission permission = Permission.READ;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Enum pour les permissions
    public enum Permission {
        READ    // Lecture seule (pour l'instant, seul READ est supporté)
    }

    // Constructeurs
    public Share() {}

    public Share(Note note, User sharedWithUser, Permission permission) {
        this.note = note;
        this.sharedWithUser = sharedWithUser;
        this.permission = permission;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Note getNote() {
        return note;
    }

    public void setNote(Note note) {
        this.note = note;
    }

    public User getSharedWithUser() {
        return sharedWithUser;
    }

    public void setSharedWithUser(User sharedWithUser) {
        this.sharedWithUser = sharedWithUser;
    }

    public Permission getPermission() {
        return permission;
    }

    public void setPermission(Permission permission) {
        this.permission = permission;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Share{" +
                "id=" + id +
                ", noteId=" + (note != null ? note.getId() : null) +
                ", sharedWithUserId=" + (sharedWithUser != null ? sharedWithUser.getId() : null) +
                ", permission=" + permission +
                ", createdAt=" + createdAt +
                '}';
    }
}
