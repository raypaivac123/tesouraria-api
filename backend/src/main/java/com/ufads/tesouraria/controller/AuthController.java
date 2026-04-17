package com.ufads.tesouraria.controller;

import com.ufads.tesouraria.dto.LoginRequestDTO;
import com.ufads.tesouraria.dto.LoginResponseDTO;
import com.ufads.tesouraria.entity.Usuario;
import com.ufads.tesouraria.mapper.UsuarioMapper;
import com.ufads.tesouraria.security.JwtService;
import com.ufads.tesouraria.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid LoginRequestDTO request) {

        Usuario usuario = usuarioService.buscarPorUsername(request.getUsername());

        if (!usuario.getAtivo()) {
            throw new RuntimeException("Usuário inativo");
        }

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Usuário ou senha inválidos");
        }

        String token = jwtService.generateToken(usuario.getUsername());

        return ResponseEntity.ok(
                UsuarioMapper.toLoginResponseDTO(usuario, token)
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDTO> refresh(Authentication authentication) {
        Usuario usuario = usuarioService.buscarPorUsername(authentication.getName());
        String token = jwtService.generateToken(usuario.getUsername());

        return ResponseEntity.ok(
                UsuarioMapper.toLoginResponseDTO(usuario, token)
        );
    }
}
