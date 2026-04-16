package com.ufads.tesouraria.mapper;

import com.ufads.tesouraria.dto.CongregacaoRequestDTO;
import com.ufads.tesouraria.dto.CongregacaoResponseDTO;
import com.ufads.tesouraria.entity.Congregacao;

public class CongregacaoMapper {

    private CongregacaoMapper(){}

    public static Congregacao toEntity(CongregacaoRequestDTO dto){

        return Congregacao.builder()
                .nome(dto.getNome())
                .cidade(dto.getCidade())
                .pastor(dto.getPastor())
                .ativo(true)
                .build();

    }

    public static CongregacaoResponseDTO toDTO(Congregacao entity){

        return CongregacaoResponseDTO.builder()
                .id(entity.getId())
                .nome(entity.getNome())
                .cidade(entity.getCidade())
                .pastor(entity.getPastor())
                .ativo(entity.getAtivo())
                .build();

    }

}