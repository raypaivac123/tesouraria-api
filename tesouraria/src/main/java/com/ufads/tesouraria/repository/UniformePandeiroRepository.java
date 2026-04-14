package com.ufads.tesouraria.repository;

import com.ufads.tesouraria.entity.UniformePandeiro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UniformePandeiroRepository extends JpaRepository<UniformePandeiro, Long> {

    List<UniformePandeiro> findByAtivoTrue();

    List<UniformePandeiro> findByCongregacaoIdAndAtivoTrue(Long congregacaoId);

}
