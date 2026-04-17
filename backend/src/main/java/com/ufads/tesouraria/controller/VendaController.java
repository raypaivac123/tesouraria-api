package com.ufads.tesouraria.controller;

import com.ufads.tesouraria.dto.VendaRequestDTO;
import com.ufads.tesouraria.dto.VendaResponseDTO;
import com.ufads.tesouraria.mapper.VendaMapper;
import com.ufads.tesouraria.service.VendaService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vendas")
@RequiredArgsConstructor
public class VendaController {

    private final VendaService service;

    @Operation(summary = "Criar venda")
    @PostMapping
    public VendaResponseDTO criar(@RequestBody @Valid VendaRequestDTO dto) {
        return VendaMapper.toResponseDTO(service.criar(dto));
    }

    @Operation(summary = "Listar vendas")
    @GetMapping
    public List<VendaResponseDTO> listar() {
        return service.listar()
                .stream()
                .map(VendaMapper::toResponseDTO)
                .toList();
    }

    @Operation(summary = "Atualizar venda")
    @PutMapping("/{id}")
    public VendaResponseDTO atualizar(@PathVariable Long id, @RequestBody @Valid VendaRequestDTO dto) {
        return VendaMapper.toResponseDTO(service.atualizar(id, dto));
    }

    @Operation(summary = "Excluir venda")
    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.desativar(id);
    }
}
