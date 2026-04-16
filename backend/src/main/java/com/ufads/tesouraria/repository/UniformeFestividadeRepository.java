package com.ufads.tesouraria.repository;

import com.ufads.tesouraria.entity.UniformeFestividade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UniformeFestividadeRepository extends JpaRepository<UniformeFestividade, Long> {

    List<UniformeFestividade> findByAtivoTrue();

    List<UniformeFestividade> findByCongregacaoIdAndAtivoTrue(Long congregacaoId);

}
