package com.ufads.tesouraria.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(
            ResourceNotFoundException ex
    ) {

        Map<String, String> erro = new HashMap<>();

        erro.put("erro", ex.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(erro);

    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(
            RuntimeException ex
    ) {

        Map<String, String> erro = new HashMap<>();

        erro.put("erro", ex.getMessage());

        return ResponseEntity.badRequest()
                .body(erro);

    }

}