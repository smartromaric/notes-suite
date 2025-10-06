package com.notes.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Gestionnaire global des exceptions
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Gestion des erreurs de validation
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ErrorResponse errorResponse = new ErrorResponse(
                "VALIDATION_ERROR",
                "Validation failed",
                errors,
                LocalDateTime.now()
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    /**
     * Gestion des erreurs d'authentification
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                "AUTHENTICATION_ERROR",
                "Invalid credentials",
                null,
                LocalDateTime.now()
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    /**
     * Gestion des erreurs runtime
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        String errorCode = "INTERNAL_ERROR";
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        // Gestion spécifique des erreurs métier
        if (ex.getMessage().contains("not found")) {
            errorCode = "NOT_FOUND";
            status = HttpStatus.NOT_FOUND;
        } else if (ex.getMessage().contains("already exists")) {
            errorCode = "CONFLICT";
            status = HttpStatus.CONFLICT;
        } else if (ex.getMessage().contains("unauthorized") || ex.getMessage().contains("forbidden")) {
            errorCode = "FORBIDDEN";
            status = HttpStatus.FORBIDDEN;
        } else if (ex.getMessage().contains("Invalid") || ex.getMessage().contains("invalid")) {
            errorCode = "BAD_REQUEST";
            status = HttpStatus.BAD_REQUEST;
        }

        ErrorResponse errorResponse = new ErrorResponse(
                errorCode,
                ex.getMessage(),
                null,
                LocalDateTime.now()
        );

        return ResponseEntity.status(status).body(errorResponse);
    }

    /**
     * Gestion des exceptions génériques
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(
                "INTERNAL_SERVER_ERROR",
                "An unexpected error occurred",
                null,
                LocalDateTime.now()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    /**
     * Classe pour les réponses d'erreur
     */
    public static class ErrorResponse {
        private String code;
        private String message;
        private Object details;
        private LocalDateTime timestamp;

        public ErrorResponse(String code, String message, Object details, LocalDateTime timestamp) {
            this.code = code;
            this.message = message;
            this.details = details;
            this.timestamp = timestamp;
        }

        // Getters
        public String getCode() { return code; }
        public String getMessage() { return message; }
        public Object getDetails() { return details; }
        public LocalDateTime getTimestamp() { return timestamp; }

        // Setters
        public void setCode(String code) { this.code = code; }
        public void setMessage(String message) { this.message = message; }
        public void setDetails(Object details) { this.details = details; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    }
}
