package com.ufads.tesouraria.dto;

import com.ufads.tesouraria.enums.FormaPagamento;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendaRequestDTO {

    private String comprador;
    private Long loteVendaId;
    private Integer quantidade;
    private BigDecimal valorPago;
    private FormaPagamento formaPagamento;
    private String observacao;
}
