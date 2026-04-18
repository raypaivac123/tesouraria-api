package com.ufads.tesouraria.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoricoAlteracaoResponseDTO {

    private Long id;
    private String entidade;
    private Long entidadeId;
    private String acao;
    private String descricao;
    private LocalDateTime dataHora;
}
