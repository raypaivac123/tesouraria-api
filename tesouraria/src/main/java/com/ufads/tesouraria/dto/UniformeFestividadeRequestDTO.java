package com.ufads.tesouraria.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UniformeFestividadeRequestDTO {

    private String nomeMulher;
    private String telefone;
    private Long congregacaoId;
    private String nomeUniforme;
    private BigDecimal valorUniforme;
    private BigDecimal valorPix;
    private BigDecimal valorDinheiro;
    private LocalDate dataPagamento;
    private String observacao;
}
