package com.ufads.tesouraria.mapper;

import com.ufads.tesouraria.dto.LoginResponseDTO;
import com.ufads.tesouraria.dto.UsuarioResponseDTO;
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

    public static UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        return UsuarioResponseDTO.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .username(usuario.getUsername())
                .role(usuario.getRole())
                .ativo(usuario.getAtivo())
                .build();
    }
}
