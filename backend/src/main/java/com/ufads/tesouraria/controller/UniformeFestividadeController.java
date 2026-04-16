package com.ufads.tesouraria.controller;

import com.ufads.tesouraria.dto.ResumoUniformeDTO;
import com.ufads.tesouraria.dto.UniformeFestividadeRequestDTO;
import com.ufads.tesouraria.dto.UniformeFestividadeResponseDTO;
import com.ufads.tesouraria.entity.UniformeFestividade;
import com.ufads.tesouraria.mapper.UniformeFestividadeMapper;
import com.ufads.tesouraria.service.UniformeFestividadeService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/uniforme-festividade")
@RequiredArgsConstructor
public class UniformeFestividadeController {

    private final UniformeFestividadeService service;

    @Operation(summary = "Criar registro de uniforme festividade")
    @PostMapping
    public UniformeFestividadeResponseDTO criar(@RequestBody UniformeFestividadeRequestDTO dto) {
        UniformeFestividade entity = service.criar(dto);
        return UniformeFestividadeMapper.toResponseDTO(entity);
    }

    @Operation(summary = "Listar registros de uniforme festividade")
    @GetMapping
    public List<UniformeFestividadeResponseDTO> listar() {
        return service.listarAtivos()
                .stream()
                .map(UniformeFestividadeMapper::toResponseDTO)
                .toList();
    }

    @Operation(summary = "Obter resumo de uniforme festividade")
    @GetMapping("/resumo")
    public ResumoUniformeDTO obterResumo() {
        return service.obterResumo();
    }

    @Operation(summary = "Buscar registro de uniforme festividade por id")
    @GetMapping("/{id}")
    public UniformeFestividadeResponseDTO buscarPorId(@PathVariable Long id) {
        return UniformeFestividadeMapper.toResponseDTO(service.buscarPorId(id));
    }

    @Operation(summary = "Atualizar registro de uniforme festividade")
    @PutMapping("/{id}")
    public UniformeFestividadeResponseDTO atualizar(
            @PathVariable Long id,
            @RequestBody UniformeFestividadeRequestDTO dto
    ) {
        UniformeFestividade entity = service.atualizar(id, dto);
        return UniformeFestividadeMapper.toResponseDTO(entity);
    }

    @Operation(summary = "Desativar registro de uniforme festividade")
    @DeleteMapping("/{id}")
    public void desativar(@PathVariable Long id) {
        service.desativar(id);
    }
}
