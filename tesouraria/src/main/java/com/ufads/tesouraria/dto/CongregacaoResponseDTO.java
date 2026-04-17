package com.ufads.tesouraria.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CongregacaoResponseDTO {

    private Long id;

    private String nome;

    private String cidade;

    private String pastor;

    private Boolean ativo;

}