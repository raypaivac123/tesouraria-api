package com.ufads.tesouraria.controller;

import com.ufads.tesouraria.dto.LoginRequestDTO;
import com.ufads.tesouraria.dto.LoginResponseDTO;
import com.ufads.tesouraria.entity.Usuario;
import com.ufads.tesouraria.mapper.UsuarioMapper;
import com.ufads.tesouraria.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")

@RequiredArgsConstructor
@CrossOrigin("*")

public class AuthController {

    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @RequestBody LoginRequestDTO request
    ){

        Usuario usuario = usuarioService.buscarPorUsername(
                request.getUsername()
        );

        if(!usuario.getAtivo()){

            throw new RuntimeException("Usuário inativo");

        }

        if(!passwordEncoder.matches(
                request.getPassword(),
                usuario.getPassword()
        )){

            throw new RuntimeException("Usuário ou senha inválidos");

        }

        return ResponseEntity.ok(

                UsuarioMapper.toLoginResponseDTO(usuario)

        );

    }

}