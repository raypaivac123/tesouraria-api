package com.ufads.tesouraria.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CongregacaoRequestDTO {

    private String nome;

    private String cidade;

    private String pastor;

}