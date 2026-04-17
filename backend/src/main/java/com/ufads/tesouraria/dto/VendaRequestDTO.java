package com.ufads.tesouraria.dto;

import com.ufads.tesouraria.enums.FormaPagamento;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendaRequestDTO {

    @NotBlank
    private String comprador;

    @NotNull
    private Long loteVendaId;

    @NotNull
    @Positive
    private Integer quantidade;

    @DecimalMin(value = "0.00")
    private BigDecimal valorPago;

    @NotNull
    private FormaPagamento formaPagamento;

    private String observacao;
}
