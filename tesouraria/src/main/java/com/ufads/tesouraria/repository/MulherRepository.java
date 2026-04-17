package com.ufads.tesouraria.repository;

import com.ufads.tesouraria.entity.Mulher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MulherRepository extends JpaRepository<Mulher, Long> {

    List<Mulher> findByAtivoTrue();

    List<Mulher> findByCongregacaoIdAndAtivoTrue(Long congregacaoId);

    long countByAtivoTrue();

}
