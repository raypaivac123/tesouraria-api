package com.ufads.tesouraria.controller;

import com.ufads.tesouraria.dto.ResumoUniformeDTO;
import com.ufads.tesouraria.dto.UniformePandeiroRequestDTO;
import com.ufads.tesouraria.dto.UniformePandeiroResponseDTO;
import com.ufads.tesouraria.mapper.UniformePandeiroMapper;
import com.ufads.tesouraria.service.UniformePandeiroService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/uniforme-pandeiro")
@RequiredArgsConstructor
public class UniformePandeiroController {

    private final UniformePandeiroService service;

    @Operation(summary = "Criar uniforme pandeiro")
    @PostMapping
    public UniformePandeiroResponseDTO criar(@RequestBody @Valid UniformePandeiroRequestDTO dto) {

        return UniformePandeiroMapper.toResponseDTO(service.criar(dto));
    }

    @Operation(summary = "Listar uniformes pandeiro")
    @GetMapping
    public List<UniformePandeiroResponseDTO> listar() {

        return service.listar()
                .stream()
                .map(UniformePandeiroMapper::toResponseDTO)
                .toList();
    }

    @Operation(summary = "Obter resumo de uniforme pandeiro")
    @GetMapping("/resumo")
    public ResumoUniformeDTO obterResumo() {
        return service.obterResumo();
    }

    @Operation(summary = "Buscar uniforme pandeiro por id")
    @GetMapping("/{id}")
    public UniformePandeiroResponseDTO buscar(@PathVariable Long id) {

        return UniformePandeiroMapper.toResponseDTO(service.buscarPorId(id));
    }

    @Operation(summary = "Atualizar uniforme pandeiro")
    @PutMapping("/{id}")
    public UniformePandeiroResponseDTO atualizar(
            @PathVariable Long id,
            @RequestBody @Valid UniformePandeiroRequestDTO dto
    ) {

        return UniformePandeiroMapper.toResponseDTO(service.atualizar(id, dto));
    }

    @Operation(summary = "Desativar uniforme pandeiro")
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {

        service.desativar(id);
    }
}
