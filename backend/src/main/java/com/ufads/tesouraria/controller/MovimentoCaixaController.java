package com.ufads.tesouraria.controller;

import com.ufads.tesouraria.dto.MovimentoCaixaRequestDTO;
import com.ufads.tesouraria.dto.MovimentoCaixaResponseDTO;
import com.ufads.tesouraria.dto.ResumoCaixaDTO;
import com.ufads.tesouraria.entity.MovimentoCaixa;
import com.ufads.tesouraria.enums.TipoMovimento;
import com.ufads.tesouraria.mapper.MovimentoCaixaMapper;
import com.ufads.tesouraria.service.MovimentoCaixaService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/caixa")
@RequiredArgsConstructor
public class MovimentoCaixaController {

    private final MovimentoCaixaService service;

    @Operation(summary = "Criar movimento de caixa")
    @PostMapping
    public MovimentoCaixaResponseDTO criar(@RequestBody @Valid MovimentoCaixaRequestDTO dto) {
        MovimentoCaixa movimento = service.criar(dto);
        return MovimentoCaixaMapper.toResponseDTO(movimento);
    }

    @Operation(summary = "Listar movimentos de caixa")
    @GetMapping
    public List<MovimentoCaixaResponseDTO> listar() {
        return service.listarAtivos()
                .stream()
                .map(MovimentoCaixaMapper::toResponseDTO)
                .toList();
    }

    @Operation(summary = "Buscar movimento de caixa por id")
    @GetMapping("/{id}")
    public MovimentoCaixaResponseDTO buscarPorId(@PathVariable Long id) {
        return MovimentoCaixaMapper.toResponseDTO(service.buscarPorId(id));
    }

    @Operation(summary = "Listar movimentos por tipo")
    @GetMapping("/tipo/{tipo}")
    public List<MovimentoCaixaResponseDTO> listarPorTipo(@PathVariable TipoMovimento tipo) {
        return service.listarPorTipo(tipo)
                .stream()
                .map(MovimentoCaixaMapper::toResponseDTO)
                .toList();
    }

    @Operation(summary = "Listar movimentos por período")
    @GetMapping("/periodo")
    public List<MovimentoCaixaResponseDTO> listarPorPeriodo(
            @RequestParam LocalDate dataInicial,
            @RequestParam LocalDate dataFinal
    ) {
        return service.listarPorPeriodo(dataInicial, dataFinal)
                .stream()
                .map(MovimentoCaixaMapper::toResponseDTO)
                .toList();
    }

    @Operation(summary = "Obter resumo do caixa")
    @GetMapping("/resumo")
    public ResumoCaixaDTO obterResumo() {
        return service.obterResumo();
    }

    @Operation(summary = "Filtrar movimentos por período e tipo")
    @GetMapping("/filtro")
    public List<MovimentoCaixaResponseDTO> filtrar(
            @RequestParam LocalDate dataInicial,
            @RequestParam LocalDate dataFinal,
            @RequestParam(required = false) TipoMovimento tipo
    ) {
        return service.listarPorPeriodoETipo(dataInicial, dataFinal, tipo)
                .stream()
                .map(MovimentoCaixaMapper::toResponseDTO)
                .toList();
    }

    @Operation(summary = "Atualizar movimento de caixa")
    @PutMapping("/{id}")
    public MovimentoCaixaResponseDTO atualizar(
            @PathVariable Long id,
            @RequestBody @Valid MovimentoCaixaRequestDTO dto
    ) {
        MovimentoCaixa movimento = service.atualizar(id, dto);
        return MovimentoCaixaMapper.toResponseDTO(movimento);
    }

    @Operation(summary = "Desativar movimento de caixa")
    @DeleteMapping("/{id}")
    public void desativar(@PathVariable Long id) {
        service.desativar(id);
    }
}
