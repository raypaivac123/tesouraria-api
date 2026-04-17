package com.ufads.tesouraria.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RelatorioFinanceiroDTO {

    private LocalDate dataInicial;
    private LocalDate dataFinal;
    private Long congregacaoId;
    private String nomeCongregacao;

    private BigDecimal totalEntradas;
    private BigDecimal totalSaidas;
    private BigDecimal saldoCaixa;
    private BigDecimal totalUniformeFestividade;
    private BigDecimal totalUniformePandeiro;
    private BigDecimal totalArrecadadoUniformes;
    private BigDecimal totalPendenteUniformes;

    private Long totalMovimentos;
    private Long totalUniformesFestividade;
    private Long totalUniformesPandeiro;

    private List<MovimentoCaixaResponseDTO> movimentos;
    private List<UniformeFestividadeResponseDTO> uniformesFestividade;
    private List<UniformePandeiroResponseDTO> uniformesPandeiro;
}
