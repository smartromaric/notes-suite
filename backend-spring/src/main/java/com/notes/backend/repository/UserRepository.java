package com.notes.backend.repository;

import com.notes.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository pour l'entité User
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Trouve un utilisateur par son email
     */
    Optional<User> findByEmail(String email);

    /**
     * Vérifie si un utilisateur existe avec cet email
     */
    boolean existsByEmail(String email);

    /**
     * Trouve un utilisateur par son email en ignorant la casse
     */
    @Query("SELECT u FROM User u WHERE LOWER(u.email) = LOWER(:email)")
    Optional<User> findByEmailIgnoreCase(@Param("email") String email);
}
