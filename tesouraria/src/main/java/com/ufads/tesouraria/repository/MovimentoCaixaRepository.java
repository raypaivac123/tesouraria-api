package com.ufads.tesouraria.repository;

import com.ufads.tesouraria.entity.MovimentoCaixa;
import com.ufads.tesouraria.enums.TipoMovimento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface MovimentoCaixaRepository extends JpaRepository<MovimentoCaixa, Long> {

    List<MovimentoCaixa> findByAtivoTrue();

    List<MovimentoCaixa> findByTipoAndAtivoTrue(TipoMovimento tipo);

    List<MovimentoCaixa> findByDataBetweenAndAtivoTrue(LocalDate dataInicial, LocalDate dataFinal);

}
