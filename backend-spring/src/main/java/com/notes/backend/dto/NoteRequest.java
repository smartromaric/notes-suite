package com.notes.backend.dto;

import com.notes.backend.model.Note;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;

/**
 * DTO pour la création/mise à jour d'une note
 */
public class NoteRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")
    private String title;

    @Size(max = 50000, message = "Content must not exceed 50,000 characters")
    private String contentMd;

    private Note.Visibility visibility;

    private Set<String> tags;

    // Constructeurs
    public NoteRequest() {}

    public NoteRequest(String title, String contentMd, Note.Visibility visibility, Set<String> tags) {
        this.title = title;
        this.contentMd = contentMd;
        this.visibility = visibility;
        this.tags = tags;
    }

    // Getters et Setters
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

    public Note.Visibility getVisibility() {
        return visibility;
    }

    public void setVisibility(Note.Visibility visibility) {
        this.visibility = visibility;
    }

    public Set<String> getTags() {
        return tags;
    }

    public void setTags(Set<String> tags) {
        this.tags = tags;
    }
}
