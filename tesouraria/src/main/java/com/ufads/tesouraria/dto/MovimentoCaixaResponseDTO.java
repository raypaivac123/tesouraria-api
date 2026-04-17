package com.ufads.tesouraria.dto;

import com.ufads.tesouraria.enums.FormaPagamento;
import com.ufads.tesouraria.enums.TipoMovimento;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimentoCaixaResponseDTO {

    private Long id;
    private LocalDate data;
    private TipoMovimento tipo;
    private String descricao;
    private String categoria;
    private FormaPagamento formaPagamento;
    private BigDecimal valor;
    private BigDecimal valorPix;
    private BigDecimal valorDinheiro;
    private String observacao;
    private String justificativa;
    private Boolean ativo;
}
