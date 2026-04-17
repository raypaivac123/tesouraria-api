package com.ufads.tesouraria.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumoUniformeDTO {

    private BigDecimal totalArrecadado;
    private BigDecimal totalPendente;
    private Long totalRegistros;
}
