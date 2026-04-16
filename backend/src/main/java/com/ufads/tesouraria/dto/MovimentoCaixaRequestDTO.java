package com.ufads.tesouraria.dto;

import com.ufads.tesouraria.enums.FormaPagamento;
import com.ufads.tesouraria.enums.TipoMovimento;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    private BigDecimal valor;

    private BigDecimal valorPix;

    private BigDecimal valorDinheiro;

    private String observacao;

    private String justificativa;
}
