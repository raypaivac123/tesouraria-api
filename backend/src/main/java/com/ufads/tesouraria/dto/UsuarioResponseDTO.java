package com.ufads.tesouraria.dto;

import com.ufads.tesouraria.enums.RoleUsuario;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioResponseDTO {

    private Long id;
    private String nome;
    private String username;
    private RoleUsuario role;
    private Boolean ativo;
}
