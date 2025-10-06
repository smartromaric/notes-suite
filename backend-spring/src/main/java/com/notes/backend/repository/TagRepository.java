package com.notes.backend.repository;

import com.notes.backend.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité Tag
 */
@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    /**
     * Trouve un tag par son label
     */
    Optional<Tag> findByLabel(String label);

    /**
     * Trouve un tag par son label en ignorant la casse
     */
    @Query("SELECT t FROM Tag t WHERE LOWER(t.label) = LOWER(:label)")
    Optional<Tag> findByLabelIgnoreCase(@Param("label") String label);

    /**
     * Vérifie si un tag existe avec ce label
     */
    boolean existsByLabel(String label);

    /**
     * Recherche des tags par label (insensible à la casse)
     */
    @Query("SELECT t FROM Tag t WHERE LOWER(t.label) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY t.label")
    List<Tag> findByLabelContainingIgnoreCase(@Param("query") String query);

    /**
     * Trouve tous les tags triés par label
     */
    List<Tag> findAllByOrderByLabel();

    /**
     * Trouve les tags les plus utilisés
     */
    @Query("SELECT t FROM Tag t JOIN t.noteTags nt GROUP BY t.id, t.label ORDER BY COUNT(nt.note) DESC")
    List<Tag> findMostUsedTags();
}
