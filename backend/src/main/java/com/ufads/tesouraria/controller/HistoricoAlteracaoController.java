package com.ufads.tesouraria.controller;

import com.ufads.tesouraria.dto.HistoricoAlteracaoResponseDTO;
import com.ufads.tesouraria.mapper.HistoricoAlteracaoMapper;
import com.ufads.tesouraria.service.HistoricoAlteracaoService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/historico")
@RequiredArgsConstructor
public class HistoricoAlteracaoController {

    private final HistoricoAlteracaoService service;

    @Operation(summary = "Listar historico de alteracoes")
    @GetMapping
    public List<HistoricoAlteracaoResponseDTO> listar(
            @RequestParam(required = false) String entidade,
            @RequestParam(required = false) Long entidadeId
    ) {
        if (entidade != null && entidadeId != null) {
            return service.listarPorEntidade(entidade, entidadeId)
                    .stream()
                    .map(HistoricoAlteracaoMapper::toResponseDTO)
                    .toList();
        }

        return service.listar()
                .stream()
                .map(HistoricoAlteracaoMapper::toResponseDTO)
                .toList();
    }
}
