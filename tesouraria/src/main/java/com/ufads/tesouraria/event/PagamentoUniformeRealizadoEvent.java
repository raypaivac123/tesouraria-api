package com.ufads.tesouraria.event;

import com.ufads.tesouraria.enums.FormaPagamento;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class PagamentoUniformeRealizadoEvent {

    private String descricao;
    private String categoria;
    private FormaPagamento formaPagamento;
    private BigDecimal valor;
    private BigDecimal valorPix;
    private BigDecimal valorDinheiro;
    private LocalDate data;
    private String observacao;
}
