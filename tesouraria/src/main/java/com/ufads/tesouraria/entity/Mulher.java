package com.ufads.tesouraria.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mulheres")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mulher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String telefone;

    @ManyToOne
    @JoinColumn(name = "congregacao_id", nullable = false)
    private Congregacao congregacao;

    @Column(nullable = false)
    private Boolean ativo = true;
}