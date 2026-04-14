package com.ufads.tesouraria.mapper;

import com.ufads.tesouraria.dto.LoteVendaResponseDTO;
import com.ufads.tesouraria.entity.LoteVenda;

public class LoteVendaMapper {

    private LoteVendaMapper() {
    }

    public static LoteVendaResponseDTO toResponseDTO(LoteVenda entity) {
        return LoteVendaResponseDTO.builder()
                .id(entity.getId())
                .produto(entity.getProduto())
                .categoria(entity.getCategoria())
                .dataVenda(entity.getDataVenda())
                .custoUnitario(entity.getCustoUnitario())
                .valorUnitario(entity.getValorUnitario())
                .observacao(entity.getObservacao())
                .ativo(entity.getAtivo())
                .build();
    }
}
