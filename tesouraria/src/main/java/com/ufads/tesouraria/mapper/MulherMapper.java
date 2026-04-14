package com.ufads.tesouraria.mapper;

import com.ufads.tesouraria.dto.MulherResponseDTO;
import com.ufads.tesouraria.entity.Mulher;

public class MulherMapper {

    public static MulherResponseDTO toResponseDTO(Mulher mulher) {

        return MulherResponseDTO.builder()
                .id(mulher.getId())
                .nome(mulher.getNome())
                .telefone(mulher.getTelefone())
                .congregacaoId(mulher.getCongregacao().getId())
                .nomeCongregacao(mulher.getCongregacao().getNome())
                .ativo(mulher.getAtivo())
                .build();
    }

}
