package com.ufads.tesouraria.repository;

import com.ufads.tesouraria.entity.LoteVenda;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoteVendaRepository extends JpaRepository<LoteVenda, Long> {

    List<LoteVenda> findByAtivoTrue();
}
