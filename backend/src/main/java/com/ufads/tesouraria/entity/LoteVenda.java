package com.ufads.tesouraria.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "lotes_venda")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoteVenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String produto;

    private String categoria;

    @Column(nullable = false)
    private LocalDate dataVenda;

    @Column(precision = 10, scale = 2)
    private BigDecimal custoUnitario;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorUnitario;

    private String observacao;

    @Column(nullable = false)
    private Boolean ativo = true;
}
