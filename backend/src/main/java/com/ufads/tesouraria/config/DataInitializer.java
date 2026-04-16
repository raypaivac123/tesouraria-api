package com.ufads.tesouraria.config;

import com.ufads.tesouraria.entity.Usuario;
import com.ufads.tesouraria.enums.RoleUsuario;
import com.ufads.tesouraria.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initAdmin() {
        return args -> {
            if (usuarioRepository.findByUsername("rayssa").isEmpty()) {
                Usuario admin = Usuario.builder()
                        .nome("Rayssa")
                        .username("rayssa")
                        .password(passwordEncoder.encode("123456"))
                        .role(RoleUsuario.ADMIN)
                        .ativo(true)
                        .build();

                usuarioRepository.save(admin);
            }
        };
    }
}