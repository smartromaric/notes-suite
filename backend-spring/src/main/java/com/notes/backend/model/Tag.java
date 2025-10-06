package com.notes.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entité Tag représentant un tag pour catégoriser les notes
 */
@Entity
@Table(name = "tags")
@EntityListeners(AuditingEntityListener.class)
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tag label is required")
    @Size(min = 2, max = 50, message = "Tag label must be between 2 and 50 characters")
    @Column(unique = true, nullable = false)
    private String label;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Relations
    @OneToMany(mappedBy = "tag", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<NoteTag> noteTags = new HashSet<>();

    // Constructeurs
    public Tag() {}

    public Tag(String label) {
        this.label = label;
    }

    // Méthodes utilitaires
    public void addNote(Note note) {
        NoteTag noteTag = new NoteTag(note, this);
        this.noteTags.add(noteTag);
        note.getNoteTags().add(noteTag);
    }

    public void removeNote(Note note) {
        NoteTag noteTag = new NoteTag(note, this);
        this.noteTags.remove(noteTag);
        note.getNoteTags().remove(noteTag);
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

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Set<NoteTag> getNoteTags() {
        return noteTags;
    }

    public void setNoteTags(Set<NoteTag> noteTags) {
        this.noteTags = noteTags;
    }

    @Override
    public String toString() {
        return "Tag{" +
                "id=" + id +
                ", label='" + label + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Tag tag = (Tag) o;
        return label != null ? label.equals(tag.label) : tag.label == null;
    }

    @Override
    public int hashCode() {
        return label != null ? label.hashCode() : 0;
    }
}
