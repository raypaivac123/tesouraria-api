package com.ufads.tesouraria.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CongregacaoRequestDTO {

    @NotBlank
    private String nome;

    @NotBlank
    private String cidade;

    private String pastor;

}
