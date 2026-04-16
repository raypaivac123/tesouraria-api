package com.ufads.tesouraria.service;

import com.ufads.tesouraria.entity.Usuario;
import com.ufads.tesouraria.exception.ResourceNotFoundException;
import com.ufads.tesouraria.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public Usuario buscarPorUsername(String username){

        return usuarioRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Usuário não encontrado"));

    }

    public Usuario salvar(Usuario usuario){
        return usuarioRepository.save(usuario);
    }

}