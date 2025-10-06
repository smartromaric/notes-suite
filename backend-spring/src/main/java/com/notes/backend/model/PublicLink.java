package com.notes.backend.model;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Entité PublicLink représentant un lien public pour accéder à une note
 */
@Entity
@Table(name = "public_links")
@EntityListeners(AuditingEntityListener.class)
public class PublicLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "note_id", nullable = false)
    private Note note;

    @Column(name = "url_token", unique = true, nullable = false)
    private String urlToken;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Constructeurs
    public PublicLink() {}

    public PublicLink(Note note, String urlToken) {
        this.note = note;
        this.urlToken = urlToken;
    }

    public PublicLink(Note note, String urlToken, LocalDateTime expiresAt) {
        this.note = note;
        this.urlToken = urlToken;
        this.expiresAt = expiresAt;
    }

    // Méthodes utilitaires
    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
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

    public String getUrlToken() {
        return urlToken;
    }

    public void setUrlToken(String urlToken) {
        this.urlToken = urlToken;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "PublicLink{" +
                "id=" + id +
                ", noteId=" + (note != null ? note.getId() : null) +
                ", urlToken='" + urlToken + '\'' +
                ", expiresAt=" + expiresAt +
                ", createdAt=" + createdAt +
                '}';
    }
}
