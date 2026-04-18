package com.ufads.tesouraria.mapper;

import com.ufads.tesouraria.dto.HistoricoAlteracaoResponseDTO;
import com.ufads.tesouraria.entity.HistoricoAlteracao;

public class HistoricoAlteracaoMapper {

    private HistoricoAlteracaoMapper() {
    }

    public static HistoricoAlteracaoResponseDTO toResponseDTO(HistoricoAlteracao entity) {
        return HistoricoAlteracaoResponseDTO.builder()
                .id(entity.getId())
                .entidade(entity.getEntidade())
                .entidadeId(entity.getEntidadeId())
                .acao(entity.getAcao())
                .descricao(entity.getDescricao())
                .dataHora(entity.getDataHora())
                .build();
    }
}
