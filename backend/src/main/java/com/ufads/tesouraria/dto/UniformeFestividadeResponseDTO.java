package com.ufads.tesouraria.dto;

import com.ufads.tesouraria.enums.StatusPagamento;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UniformeFestividadeResponseDTO {

    private Long id;
    private String nomeMulher;
    private String telefone;
    private Long congregacaoId;
    private String nomeCongregacao;
    private String nomeUniforme;
    private BigDecimal valorUniforme;
    private BigDecimal valorPix;
    private BigDecimal valorDinheiro;
    private BigDecimal totalPago;
    private BigDecimal saldoPendente;
    private StatusPagamento statusPagamento;
    private Integer numeroParcelas;
    private Integer parcelaAtual;
    private LocalDate dataPagamento;
    private String observacao;
    private Boolean ativo;
}
