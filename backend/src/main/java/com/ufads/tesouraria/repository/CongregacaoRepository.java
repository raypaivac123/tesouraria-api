package com.ufads.tesouraria.repository;

import com.ufads.tesouraria.entity.Congregacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CongregacaoRepository extends JpaRepository<Congregacao, Long> {

    long countByAtivoTrue();
}
