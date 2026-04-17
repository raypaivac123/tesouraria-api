package com.ufads.tesouraria.controller;

import com.ufads.tesouraria.dto.UsuarioRequestDTO;
import com.ufads.tesouraria.dto.UsuarioResponseDTO;
import com.ufads.tesouraria.mapper.UsuarioMapper;
import com.ufads.tesouraria.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UsuarioController {

    private final UsuarioService service;

    @Operation(summary = "Cadastrar usuario")
    @PostMapping
    public UsuarioResponseDTO criar(@RequestBody @Valid UsuarioRequestDTO dto) {
        return UsuarioMapper.toResponseDTO(service.criar(dto));
    }

    @Operation(summary = "Listar usuarios ativos")
    @GetMapping
    public List<UsuarioResponseDTO> listar() {
        return service.listarAtivos()
                .stream()
                .map(UsuarioMapper::toResponseDTO)
                .toList();
    }

    @Operation(summary = "Buscar usuario por id")
    @GetMapping("/{id}")
    public UsuarioResponseDTO buscarPorId(@PathVariable Long id) {
        return UsuarioMapper.toResponseDTO(service.buscarPorId(id));
    }

    @Operation(summary = "Atualizar usuario")
    @PutMapping("/{id}")
    public UsuarioResponseDTO atualizar(
            @PathVariable Long id,
            @RequestBody @Valid UsuarioRequestDTO dto
    ) {
        return UsuarioMapper.toResponseDTO(service.atualizar(id, dto));
    }

    @Operation(summary = "Desativar usuario")
    @DeleteMapping("/{id}")
    public void desativar(@PathVariable Long id) {
        service.desativar(id);
    }
}
