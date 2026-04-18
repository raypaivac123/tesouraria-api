package com.ufads.tesouraria.service;

import com.ufads.tesouraria.dto.UsuarioRequestDTO;
import com.ufads.tesouraria.entity.Usuario;
import com.ufads.tesouraria.enums.RoleUsuario;
import com.ufads.tesouraria.exception.ResourceNotFoundException;
import com.ufads.tesouraria.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public Usuario buscarPorUsername(String username){

        return usuarioRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Usuário não encontrado"));

    }

    public Usuario salvar(Usuario usuario){
        return usuarioRepository.save(usuario);
    }

    public Usuario criar(UsuarioRequestDTO dto) {
        if (usuarioRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username ja cadastrado");
        }

        Usuario usuario = Usuario.builder()
                .nome(dto.getNome())
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(dto.getRole())
                .ativo(true)
                .build();

        return usuarioRepository.save(usuario);
    }

    public Usuario registrar(String nome, String username, String password) {
        if (usuarioRepository.existsByUsername(username)) {
            throw new RuntimeException("Username ja cadastrado");
        }

        Usuario usuario = Usuario.builder()
                .nome(nome)
                .username(username)
                .password(passwordEncoder.encode(password))
                .role(RoleUsuario.OPERADOR)
                .ativo(true)
                .build();

        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listarAtivos() {
        return usuarioRepository.findByAtivoTrue();
    }

    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado"));
    }

    public Usuario atualizar(Long id, UsuarioRequestDTO dto) {
        Usuario usuario = buscarPorId(id);

        if (!usuario.getUsername().equals(dto.getUsername())
                && usuarioRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username ja cadastrado");
        }

        usuario.setNome(dto.getNome());
        usuario.setUsername(dto.getUsername());
        usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        usuario.setRole(dto.getRole());

        return usuarioRepository.save(usuario);
    }

    public void desativar(Long id) {
        Usuario usuario = buscarPorId(id);
        usuario.setAtivo(false);
        usuarioRepository.save(usuario);
    }

}
