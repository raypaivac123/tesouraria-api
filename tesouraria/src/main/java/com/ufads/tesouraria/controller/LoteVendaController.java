package com.ufads.tesouraria.controller;

import com.ufads.tesouraria.dto.LoteVendaRequestDTO;
import com.ufads.tesouraria.dto.LoteVendaResponseDTO;
import com.ufads.tesouraria.mapper.LoteVendaMapper;
import com.ufads.tesouraria.service.LoteVendaService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lotes-venda")
@RequiredArgsConstructor
public class LoteVendaController {

    private final LoteVendaService service;

    @Operation(summary = "Criar lote de venda")
    @PostMapping
    public LoteVendaResponseDTO criar(@RequestBody LoteVendaRequestDTO dto) {
        return LoteVendaMapper.toResponseDTO(service.criar(dto));
    }

    @Operation(summary = "Listar lotes de venda")
    @GetMapping
    public List<LoteVendaResponseDTO> listar() {
        return service.listar()
                .stream()
                .map(LoteVendaMapper::toResponseDTO)
                .toList();
    }
}
