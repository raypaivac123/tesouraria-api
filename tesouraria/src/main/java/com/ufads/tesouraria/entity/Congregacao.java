package com.ufads.tesouraria.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "congregacoes")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Congregacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String cidade;

    private String pastor;

    @Column(nullable = false)
    private Boolean ativo = true;
}