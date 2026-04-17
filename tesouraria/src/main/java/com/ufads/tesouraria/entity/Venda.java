package com.ufads.tesouraria.entity;

import com.ufads.tesouraria.enums.FormaPagamento;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "vendas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Venda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String comprador;

    @ManyToOne
    @JoinColumn(name = "lote_venda_id", nullable = false)
    private LoteVenda loteVenda;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Column(precision = 10, scale = 2)
    private BigDecimal custoTotal;

    @Column(precision = 10, scale = 2)
    private BigDecimal lucroPrevisto;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorPago;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pendente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FormaPagamento formaPagamento;

    @Column(nullable = false)
    private String statusPagamento;

    private String observacao;

    @Column(nullable = false)
    private Boolean ativo = true;
}
