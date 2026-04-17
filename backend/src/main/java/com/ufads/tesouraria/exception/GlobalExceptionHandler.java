package com.ufads.tesouraria.exception;

import com.ufads.tesouraria.dto.ErrorResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(criarErro(HttpStatus.NOT_FOUND, "Recurso nao encontrado", ex.getMessage(), null));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> campos = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        fieldError -> fieldError.getField(),
                        fieldError -> fieldError.getDefaultMessage() == null
                                ? "Valor invalido"
                                : fieldError.getDefaultMessage(),
                        (mensagemAtual, mensagemNova) -> mensagemAtual,
                        LinkedHashMap::new
                ));

        return ResponseEntity.badRequest()
                .body(criarErro(
                        HttpStatus.BAD_REQUEST,
                        "Dados invalidos",
                        "Verifique os campos enviados",
                        campos
                ));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponseDTO> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(criarErro(
                        HttpStatus.FORBIDDEN,
                        "Acesso negado",
                        "Voce nao possui permissao para acessar este recurso",
                        null
                ));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponseDTO> handleRuntime(RuntimeException ex) {
        return ResponseEntity.badRequest()
                .body(criarErro(HttpStatus.BAD_REQUEST, "Erro de regra de negocio", ex.getMessage(), null));
    }

    private ErrorResponseDTO criarErro(
            HttpStatus status,
            String erro,
            String mensagem,
            Map<String, String> campos
    ) {
        return ErrorResponseDTO.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .erro(erro)
                .mensagem(mensagem)
                .campos(campos)
                .build();
    }
}
