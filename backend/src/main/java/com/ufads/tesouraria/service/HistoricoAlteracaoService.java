package com.ufads.tesouraria.service;

import com.ufads.tesouraria.entity.HistoricoAlteracao;
import com.ufads.tesouraria.repository.HistoricoAlteracaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoricoAlteracaoService {

    private final HistoricoAlteracaoRepository repository;

    public void registrar(String entidade, Long entidadeId, String acao, String descricao) {
        repository.save(HistoricoAlteracao.builder()
                .entidade(entidade)
                .entidadeId(entidadeId)
                .acao(acao)
                .descricao(descricao)
                .dataHora(LocalDateTime.now())
                .build());
    }

    public List<HistoricoAlteracao> listar() {
        return repository.findAllByOrderByDataHoraDesc();
    }

    public List<HistoricoAlteracao> listarPorEntidade(String entidade, Long entidadeId) {
        return repository.findByEntidadeAndEntidadeIdOrderByDataHoraDesc(entidade, entidadeId);
    }
}
