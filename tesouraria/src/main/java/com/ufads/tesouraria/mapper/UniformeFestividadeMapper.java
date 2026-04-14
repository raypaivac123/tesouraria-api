package com.ufads.tesouraria.mapper;

import com.ufads.tesouraria.dto.UniformeFestividadeResponseDTO;
import com.ufads.tesouraria.entity.UniformeFestividade;

public class UniformeFestividadeMapper {

    private UniformeFestividadeMapper() {
    }

    public static UniformeFestividadeResponseDTO toResponseDTO(UniformeFestividade entity) {
        return UniformeFestividadeResponseDTO.builder()
                .id(entity.getId())
                .nomeMulher(entity.getNomeMulher())
                .telefone(entity.getTelefone())
                .congregacaoId(entity.getCongregacao().getId())
                .nomeCongregacao(entity.getCongregacao().getNome())
                .nomeUniforme(entity.getNomeUniforme())
                .valorUniforme(entity.getValorUniforme())
                .valorPix(entity.getValorPix())
                .valorDinheiro(entity.getValorDinheiro())
                .totalPago(entity.getTotalPago())
                .saldoPendente(entity.getSaldoPendente())
                .statusPagamento(entity.getStatusPagamento())
                .dataPagamento(entity.getDataPagamento())
                .observacao(entity.getObservacao())
                .ativo(entity.getAtivo())
                .build();
    }
}
