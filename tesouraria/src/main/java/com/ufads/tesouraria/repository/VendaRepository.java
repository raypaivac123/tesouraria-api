package com.ufads.tesouraria.repository;

import com.ufads.tesouraria.entity.Venda;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VendaRepository extends JpaRepository<Venda, Long> {

    List<Venda> findByAtivoTrue();
}
