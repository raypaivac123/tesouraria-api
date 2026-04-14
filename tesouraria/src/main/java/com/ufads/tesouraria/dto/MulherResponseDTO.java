package com.ufads.tesouraria.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MulherResponseDTO {

    private Long id;

    private String nome;

    private String telefone;

    private Long congregacaoId;

    private String nomeCongregacao;

    private Boolean ativo;
}
