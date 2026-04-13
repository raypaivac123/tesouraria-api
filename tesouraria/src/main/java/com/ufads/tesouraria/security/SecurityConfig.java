package com.ufads.tesouraria.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // desativa proteção CSRF (necessário para API REST)
                .csrf(csrf -> csrf.disable())

                // habilita CORS (necessário para React depois)
                .cors(Customizer.withDefaults())

                // configura permissões de acesso
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/auth/**",

                                // swagger
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",

                                // opcional
                                "/error"
                        ).permitAll()

                        // qualquer outra rota precisa estar autenticada
                        .anyRequest().authenticated()
                )

                // desativa tela de login padrão do spring
                .formLogin(form -> form.disable())

                // desativa popup de login básico
                .httpBasic(httpBasic -> httpBasic.disable());

        return http.build();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();

    }
}