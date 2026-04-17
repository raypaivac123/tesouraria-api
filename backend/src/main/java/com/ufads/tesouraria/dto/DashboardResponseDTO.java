package com.ufads.tesouraria.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponseDTO {

    private BigDecimal totalEntradas;
    private BigDecimal totalSaidas;
    private BigDecimal saldoAtual;

    private Long totalCongregacoes;
    private Long totalMulheres;

    private BigDecimal totalUniformeFestividade;
    private BigDecimal totalUniformePandeiro;

    private BigDecimal totalPendenteUniformeFestividade;
    private BigDecimal totalPendenteUniformePandeiro;
    private BigDecimal totalArrecadadoUniformes;
    private BigDecimal totalPendenteUniformes;
    private Long totalRegistrosUniformes;
}
