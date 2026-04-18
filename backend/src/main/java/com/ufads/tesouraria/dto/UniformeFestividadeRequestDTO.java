package com.ufads.tesouraria.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UniformeFestividadeRequestDTO {

    @NotBlank
    private String nomeMulher;

    private String telefone;

    @NotNull
    private Long congregacaoId;

    @NotBlank
    private String nomeUniforme;

    @NotNull
    @Positive
    private BigDecimal valorUniforme;

    @DecimalMin(value = "0.00")
    private BigDecimal valorPix;

    @DecimalMin(value = "0.00")
    private BigDecimal valorDinheiro;

    private Integer numeroParcelas;

    private Integer parcelaAtual;

    private LocalDate dataPagamento;

    private String observacao;
}
