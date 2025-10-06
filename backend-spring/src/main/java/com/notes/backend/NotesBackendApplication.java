package com.notes.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Application principale pour l'API de gestion de notes collaboratives
 * 
 * @author Notes Team
 * @version 1.0
 */
@SpringBootApplication
@EnableJpaAuditing
public class NotesBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(NotesBackendApplication.class, args);
    }
}
