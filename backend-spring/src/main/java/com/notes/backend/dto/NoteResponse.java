package com.notes.backend.dto;

import com.notes.backend.model.Note;
import com.notes.backend.model.Tag;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * DTO pour la réponse d'une note
 */
public class NoteResponse {

    private Long id;
    private String title;
    private String contentMd;
    private Note.Visibility visibility;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserResponse owner;
    private Set<TagResponse> tags;
    private Set<ShareResponse> shares;

    // Constructeurs
    public NoteResponse() {}

    public NoteResponse(Note note) {
        this.id = note.getId();
        this.title = note.getTitle();
        this.contentMd = note.getContentMd();
        this.visibility = note.getVisibility();
        this.createdAt = note.getCreatedAt();
        this.updatedAt = note.getUpdatedAt();
        this.owner = new UserResponse(note.getOwner());
        this.tags = note.getNoteTags().stream()
                .map(noteTag -> new TagResponse(noteTag.getTag()))
                .collect(Collectors.toSet());
        this.shares = note.getShares().stream()
                .map(ShareResponse::new)
                .collect(Collectors.toSet());
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Note.Visibility getVisibility() {
        return visibility;
    }

    public void setVisibility(Note.Visibility visibility) {
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

    public UserResponse getOwner() {
        return owner;
    }

    public void setOwner(UserResponse owner) {
        this.owner = owner;
    }

    public Set<TagResponse> getTags() {
        return tags;
    }

    public void setTags(Set<TagResponse> tags) {
        this.tags = tags;
    }

    public Set<ShareResponse> getShares() {
        return shares;
    }

    public void setShares(Set<ShareResponse> shares) {
        this.shares = shares;
    }

    /**
     * DTO pour les informations utilisateur
     */
    public static class UserResponse {
        private Long id;
        private String name;
        private String email;

        public UserResponse() {}

        public UserResponse(com.notes.backend.model.User user) {
            this.id = user.getId();
            this.name = user.getName();
            this.email = user.getEmail();
        }

        // Getters et Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

    /**
     * DTO pour les informations de tag
     */
    public static class TagResponse {
        private Long id;
        private String label;

        public TagResponse() {}

        public TagResponse(Tag tag) {
            this.id = tag.getId();
            this.label = tag.getLabel();
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
    }

    /**
     * DTO pour les informations de partage
     */
    public static class ShareResponse {
        private Long id;
        private UserResponse sharedWithUser;
        private com.notes.backend.model.Share.Permission permission;
        private LocalDateTime createdAt;

        public ShareResponse() {}

        public ShareResponse(com.notes.backend.model.Share share) {
            this.id = share.getId();
            this.sharedWithUser = new UserResponse(share.getSharedWithUser());
            this.permission = share.getPermission();
            this.createdAt = share.getCreatedAt();
        }

        // Getters et Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public UserResponse getSharedWithUser() {
            return sharedWithUser;
        }

        public void setSharedWithUser(UserResponse sharedWithUser) {
            this.sharedWithUser = sharedWithUser;
        }

        public com.notes.backend.model.Share.Permission getPermission() {
            return permission;
        }

        public void setPermission(com.notes.backend.model.Share.Permission permission) {
            this.permission = permission;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
    }
}
