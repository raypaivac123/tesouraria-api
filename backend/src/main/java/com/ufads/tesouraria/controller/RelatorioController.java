package com.ufads.tesouraria.controller;

import com.ufads.tesouraria.dto.RelatorioFinanceiroDTO;
import com.ufads.tesouraria.service.RelatorioService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/relatorios")
@RequiredArgsConstructor
public class RelatorioController {

    private final RelatorioService service;

    @Operation(summary = "Gerar relatorio financeiro por periodo e congregacao")
    @GetMapping("/financeiro")
    public RelatorioFinanceiroDTO gerarFinanceiro(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicial,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFinal,
            @RequestParam(required = false) Long congregacaoId
    ) {
        return service.gerarFinanceiro(dataInicial, dataFinal, congregacaoId);
    }

    @Operation(summary = "Exportar relatorio financeiro em CSV")
    @GetMapping(value = "/financeiro/csv", produces = "text/csv")
    public ResponseEntity<String> exportarCsv(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicial,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFinal,
            @RequestParam(required = false) Long congregacaoId
    ) {
        String csv = service.gerarCsv(dataInicial, dataFinal, congregacaoId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/csv"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio-financeiro.csv")
                .body(csv);
    }
}
