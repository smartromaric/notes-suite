package com.notes.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entité Note représentant une note dans l'application
 */
@Entity
@Table(name = "notes")
@EntityListeners(AuditingEntityListener.class)
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")
    @Column(nullable = false)
    private String title;

    @Size(max = 50000, message = "Content must not exceed 50,000 characters")
    @Column(name = "content_md", columnDefinition = "TEXT")
    private String contentMd;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Visibility visibility = Visibility.PRIVATE;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relations
    @OneToMany(mappedBy = "note", cascade = {CascadeType.ALL, CascadeType.REMOVE}, fetch = FetchType.LAZY, orphanRemoval = true)
    private Set<NoteTag> noteTags = new HashSet<>();

    @OneToMany(mappedBy = "note", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Share> shares = new HashSet<>();

    @OneToMany(mappedBy = "note", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<PublicLink> publicLinks = new HashSet<>();

    // Enum pour la visibilité
    public enum Visibility {
        PRIVATE,    // Visible uniquement par le propriétaire
        SHARED,     // Partagée avec des utilisateurs spécifiques
        PUBLIC      // Visible publiquement via un lien
    }

    // Constructeurs
    public Note() {}

    public Note(User owner, String title, String contentMd, Visibility visibility) {
        this.owner = owner;
        this.title = title;
        this.contentMd = contentMd;
        this.visibility = visibility;
    }

    // Méthodes utilitaires
    public void addTag(Tag tag) {
        NoteTag noteTag = new NoteTag(this, tag);
        this.noteTags.add(noteTag);
        tag.getNoteTags().add(noteTag);
    }

    public void removeTag(Tag tag) {
        NoteTag noteTag = new NoteTag(this, tag);
        this.noteTags.remove(noteTag);
        tag.getNoteTags().remove(noteTag);
        noteTag.setNote(null);
        noteTag.setTag(null);
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContentMd() {
        return contentMd;
    }

    public void setContentMd(String contentMd) {
        this.contentMd = contentMd;
    }

    public Visibility getVisibility() {
        return visibility;
    }

    public void setVisibility(Visibility visibility) {
        this.visibility = visibility;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Set<NoteTag> getNoteTags() {
        return noteTags;
    }

    public void setNoteTags(Set<NoteTag> noteTags) {
        this.noteTags = noteTags;
    }

    public Set<Share> getShares() {
        return shares;
    }

    public void setShares(Set<Share> shares) {
        this.shares = shares;
    }

    public Set<PublicLink> getPublicLinks() {
        return publicLinks;
    }

    public void setPublicLinks(Set<PublicLink> publicLinks) {
        this.publicLinks = publicLinks;
    }

    @Override
    public String toString() {
        return "Note{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", visibility=" + visibility +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
