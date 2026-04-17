package com.ufads.tesouraria.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {

    private String mensagem;
    private String username;
    private String role;
    private String token;
}