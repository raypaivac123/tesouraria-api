package com.ufads.tesouraria.mapper;

import com.ufads.tesouraria.dto.MovimentoCaixaResponseDTO;
import com.ufads.tesouraria.entity.MovimentoCaixa;

public class MovimentoCaixaMapper {

    private MovimentoCaixaMapper() {
    }

    public static MovimentoCaixaResponseDTO toResponseDTO(MovimentoCaixa movimento) {
        return MovimentoCaixaResponseDTO.builder()
                .id(movimento.getId())
                .data(movimento.getData())
                .tipo(movimento.getTipo())
                .descricao(movimento.getDescricao())
                .categoria(movimento.getCategoria())
                .formaPagamento(movimento.getFormaPagamento())
                .valor(movimento.getValor())
                .valorPix(movimento.getValorPix())
                .valorDinheiro(movimento.getValorDinheiro())
                .observacao(movimento.getObservacao())
                .justificativa(movimento.getJustificativa())
                .ativo(movimento.getAtivo())
                .build();
    }
}
