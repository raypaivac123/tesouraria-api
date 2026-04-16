package com.ufads.tesouraria.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MulherRequestDTO {

    @NotBlank
    private String nome;

    private String telefone;

    @NotNull
    private Long congregacaoId;
}
