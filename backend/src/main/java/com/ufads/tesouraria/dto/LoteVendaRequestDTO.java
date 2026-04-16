package com.ufads.tesouraria.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoteVendaRequestDTO {

    private String produto;
    private String categoria;
    private LocalDate dataVenda;
    private BigDecimal custoUnitario;
    private BigDecimal valorUnitario;
    private String observacao;
}
