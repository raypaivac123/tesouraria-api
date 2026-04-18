package com.ufads.tesouraria.dto;

import com.ufads.tesouraria.enums.FormaPagamento;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendaResponseDTO {

    private Long id;
    private String comprador;
    private Long loteVendaId;
    private String produto;
    private Integer quantidade;
    private BigDecimal total;
    private BigDecimal custoTotal;
    private BigDecimal lucroPrevisto;
    private BigDecimal valorPago;
    private BigDecimal valorPix;
    private BigDecimal valorDinheiro;
    private BigDecimal pendente;
    private FormaPagamento formaPagamento;
    private String statusPagamento;
    private Integer numeroParcelas;
    private Integer parcelaAtual;
    private String observacao;
    private Boolean ativo;
}
