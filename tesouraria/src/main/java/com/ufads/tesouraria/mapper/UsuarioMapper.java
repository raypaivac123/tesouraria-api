package com.ufads.tesouraria.mapper;

import com.ufads.tesouraria.dto.LoginResponseDTO;
import com.ufads.tesouraria.entity.Usuario;

public class UsuarioMapper {

    private UsuarioMapper() {
    }

    public static LoginResponseDTO toLoginResponseDTO(Usuario usuario, String token) {
        return LoginResponseDTO.builder()
                .mensagem("Login realizado com sucesso")
                .username(usuario.getUsername())
                .role(usuario.getRole().name())
                .token(token)
                .build();
    }
}
