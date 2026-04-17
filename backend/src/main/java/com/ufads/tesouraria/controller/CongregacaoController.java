package com.ufads.tesouraria.controller;

import com.ufads.tesouraria.dto.CongregacaoRequestDTO;
import com.ufads.tesouraria.dto.CongregacaoResponseDTO;
import com.ufads.tesouraria.service.CongregacaoService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/congregacoes")
@RequiredArgsConstructor
public class CongregacaoController {

    private final CongregacaoService service;


    @Operation(summary = "Criar congregação")
    @PostMapping
    public CongregacaoResponseDTO criar(@RequestBody @Valid CongregacaoRequestDTO dto){

        return service.criar(dto);

    }


    @Operation(summary = "Listar congregações")
    @GetMapping
    public List<CongregacaoResponseDTO> listar(){

        return service.listar();

    }


    @Operation(summary = "Buscar congregação por id")
    @GetMapping("/{id}")
    public CongregacaoResponseDTO buscarPorId(@PathVariable Long id){

        return service.buscarPorId(id);

    }


    @Operation(summary = "Atualizar congregação")
    @PutMapping("/{id}")
    public CongregacaoResponseDTO atualizar(
            @PathVariable Long id,
            @RequestBody @Valid CongregacaoRequestDTO dto
    ){

        return service.atualizar(id, dto);

    }


    @Operation(summary = "Desativar congregação")
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id){

        service.deletar(id);

    }

}
