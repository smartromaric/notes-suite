package com.notes.backend.service;

import com.notes.backend.dto.AuthResponse;
import com.notes.backend.dto.LoginRequest;
import com.notes.backend.dto.RegisterRequest;
import com.notes.backend.model.User;
import com.notes.backend.repository.UserRepository;
import com.notes.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service pour l'authentification des utilisateurs
 */
@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Inscription d'un nouvel utilisateur
     */
    public AuthResponse register(RegisterRequest request) {
        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Créer le nouvel utilisateur
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        // Sauvegarder l'utilisateur
        User savedUser = userRepository.save(user);

        // Générer les tokens JWT
        String accessToken = jwtUtil.generateAccessToken(savedUser.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(savedUser.getEmail());

        // Retourner la réponse
        return new AuthResponse(accessToken, refreshToken, jwtUtil.getExpirationTime(), savedUser);
    }

    /**
     * Connexion d'un utilisateur
     */
    public AuthResponse login(LoginRequest request) {
        // Trouver l'utilisateur par email
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = userOptional.get();

        // Vérifier le mot de passe
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Générer les tokens JWT
        String accessToken = jwtUtil.generateAccessToken(user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        // Retourner la réponse
        return new AuthResponse(accessToken, refreshToken, jwtUtil.getExpirationTime(), user);
    }

    /**
     * Rafraîchir le token d'accès
     */
    public AuthResponse refreshToken(String refreshToken) {
        // Valider le refresh token
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        // Extraire l'email du token
        String email = jwtUtil.extractEmail(refreshToken);
        
        // Trouver l'utilisateur
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOptional.get();

        // Générer un nouveau token d'accès
        String newAccessToken = jwtUtil.generateAccessToken(user.getEmail());

        // Retourner la réponse
        return new AuthResponse(newAccessToken, refreshToken, jwtUtil.getExpirationTime(), user);
    }

    /**
     * Trouver un utilisateur par email
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
