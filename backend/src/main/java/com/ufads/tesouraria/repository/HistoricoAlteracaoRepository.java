package com.ufads.tesouraria.repository;

import com.ufads.tesouraria.entity.HistoricoAlteracao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoricoAlteracaoRepository extends JpaRepository<HistoricoAlteracao, Long> {

    List<HistoricoAlteracao> findByEntidadeAndEntidadeIdOrderByDataHoraDesc(String entidade, Long entidadeId);

    List<HistoricoAlteracao> findAllByOrderByDataHoraDesc();
}
