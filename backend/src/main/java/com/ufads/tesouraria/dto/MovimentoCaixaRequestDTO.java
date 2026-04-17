package com.ufads.tesouraria.dto;

import com.ufads.tesouraria.enums.FormaPagamento;
import com.ufads.tesouraria.enums.TipoMovimento;
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
public class MovimentoCaixaRequestDTO {

    @NotNull
    private LocalDate data;

    @NotNull
    private TipoMovimento tipo;

    @NotBlank
    private String descricao;

    @NotBlank
    private String categoria;

    @NotNull
    private FormaPagamento formaPagamento;

    @NotNull
    @Positive
    private BigDecimal valor;

    @DecimalMin(value = "0.00")
    private BigDecimal valorPix;

    @DecimalMin(value = "0.00")
    private BigDecimal valorDinheiro;

    private String observacao;

    private String justificativa;
}
