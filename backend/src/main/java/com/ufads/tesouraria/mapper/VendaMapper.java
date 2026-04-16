package com.ufads.tesouraria.mapper;

import com.ufads.tesouraria.dto.VendaResponseDTO;
import com.ufads.tesouraria.entity.Venda;

public class VendaMapper {

    private VendaMapper() {
    }

    public static VendaResponseDTO toResponseDTO(Venda entity) {
        return VendaResponseDTO.builder()
                .id(entity.getId())
                .comprador(entity.getComprador())
                .loteVendaId(entity.getLoteVenda().getId())
                .produto(entity.getLoteVenda().getProduto())
                .quantidade(entity.getQuantidade())
                .total(entity.getTotal())
                .custoTotal(entity.getCustoTotal())
                .lucroPrevisto(entity.getLucroPrevisto())
                .valorPago(entity.getValorPago())
                .pendente(entity.getPendente())
                .formaPagamento(entity.getFormaPagamento())
                .statusPagamento(entity.getStatusPagamento())
                .observacao(entity.getObservacao())
                .ativo(entity.getAtivo())
                .build();
    }
}
