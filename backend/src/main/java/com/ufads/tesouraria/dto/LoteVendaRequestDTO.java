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
public class LoteVendaRequestDTO {

    @NotBlank
    private String produto;

    @NotBlank
    private String categoria;

    @NotNull
    private LocalDate dataVenda;

    @DecimalMin(value = "0.00")
    private BigDecimal custoUnitario;

    @NotNull
    @Positive
    private BigDecimal valorUnitario;

    private String observacao;
}
