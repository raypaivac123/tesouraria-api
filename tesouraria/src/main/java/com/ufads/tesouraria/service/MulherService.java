package com.ufads.tesouraria.service;

import com.ufads.tesouraria.dto.MulherRequestDTO;
import com.ufads.tesouraria.entity.Congregacao;
import com.ufads.tesouraria.entity.Mulher;
import com.ufads.tesouraria.exception.ResourceNotFoundException;
import com.ufads.tesouraria.repository.CongregacaoRepository;
import com.ufads.tesouraria.repository.MulherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MulherService {

    private final MulherRepository mulherRepository;
    private final CongregacaoRepository congregacaoRepository;

    public Mulher criar(MulherRequestDTO dto) {

        Congregacao congregacao = congregacaoRepository.findById(dto.getCongregacaoId())
                .orElseThrow(() -> new ResourceNotFoundException("Congregação não encontrada"));

        Mulher mulher = Mulher.builder()
                .nome(dto.getNome())
                .telefone(dto.getTelefone())
                .congregacao(congregacao)
                .ativo(true)
                .build();

        return mulherRepository.save(mulher);
    }

    public List<Mulher> listarAtivas() {
        return mulherRepository.findByAtivoTrue();
    }

    public Mulher buscarPorId(Long id) {

        return mulherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mulher não encontrada"));
    }

    public Mulher atualizar(Long id, MulherRequestDTO dto) {

        Mulher mulher = buscarPorId(id);

        Congregacao congregacao = congregacaoRepository.findById(dto.getCongregacaoId())
                .orElseThrow(() -> new ResourceNotFoundException("Congregação não encontrada"));

        mulher.setNome(dto.getNome());
        mulher.setTelefone(dto.getTelefone());
        mulher.setCongregacao(congregacao);

        return mulherRepository.save(mulher);
    }

    public void desativar(Long id) {

        Mulher mulher = buscarPorId(id);

        mulher.setAtivo(false);

        mulherRepository.save(mulher);
    }
}
