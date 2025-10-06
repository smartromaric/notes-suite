package com.notes.backend.dto;

import com.notes.backend.model.User;

/**
 * DTO pour la réponse d'authentification
 */
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private Long expiresIn;
    private UserResponse user;

    // Constructeurs
    public AuthResponse() {}

    public AuthResponse(String accessToken, String refreshToken, Long expiresIn, User user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.user = new UserResponse(user);
    }

    // Getters et Setters
    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(Long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }

    /**
     * DTO pour les informations utilisateur dans la réponse
     */
    public static class UserResponse {
        private Long id;
        private String name;
        private String email;
        private String createdAt;

        public UserResponse() {}

        public UserResponse(User user) {
            this.id = user.getId();
            this.name = user.getName();
            this.email = user.getEmail();
            this.createdAt = user.getCreatedAt() != null ? user.getCreatedAt().toString() : null;
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

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }
    }
}
