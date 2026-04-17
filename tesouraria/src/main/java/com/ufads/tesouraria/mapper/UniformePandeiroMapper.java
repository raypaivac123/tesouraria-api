package com.ufads.tesouraria.mapper;

import com.ufads.tesouraria.dto.UniformePandeiroResponseDTO;
import com.ufads.tesouraria.entity.UniformePandeiro;

public class UniformePandeiroMapper {

    private UniformePandeiroMapper() {
    }

    public static UniformePandeiroResponseDTO toResponseDTO(UniformePandeiro entity) {

        return UniformePandeiroResponseDTO.builder()
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
