package com.ufads.tesouraria.entity;

import com.ufads.tesouraria.enums.StatusPagamento;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "uniformes_festividade")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UniformeFestividade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomeMulher;

    private String telefone;

    @ManyToOne
    @JoinColumn(name = "congregacao_id", nullable = false)
    private Congregacao congregacao;

    @Column(nullable = false)
    private String nomeUniforme;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorUniforme;

    @Column(precision = 10, scale = 2)
    private BigDecimal valorPix;

    @Column(precision = 10, scale = 2)
    private BigDecimal valorDinheiro;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPago;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal saldoPendente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPagamento statusPagamento;

    private LocalDate dataPagamento;

    @Column(length = 500)
    private String observacao;

    @Column(nullable = false)
    private Boolean ativo = true;
}
