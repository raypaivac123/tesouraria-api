package com.ufads.tesouraria.service;

import com.ufads.tesouraria.dto.DashboardResponseDTO;
import com.ufads.tesouraria.entity.MovimentoCaixa;
import com.ufads.tesouraria.entity.UniformeFestividade;
import com.ufads.tesouraria.entity.UniformePandeiro;
import com.ufads.tesouraria.enums.TipoMovimento;
import com.ufads.tesouraria.repository.CongregacaoRepository;
import com.ufads.tesouraria.repository.MovimentoCaixaRepository;
import com.ufads.tesouraria.repository.MulherRepository;
import com.ufads.tesouraria.repository.UniformeFestividadeRepository;
import com.ufads.tesouraria.repository.UniformePandeiroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final MovimentoCaixaRepository movimentoCaixaRepository;
    private final CongregacaoRepository congregacaoRepository;
    private final MulherRepository mulherRepository;
    private final UniformeFestividadeRepository uniformeFestividadeRepository;
    private final UniformePandeiroRepository uniformePandeiroRepository;

    public DashboardResponseDTO obterResumo() {

        List<MovimentoCaixa> movimentos = movimentoCaixaRepository.findByAtivoTrue();
        List<UniformeFestividade> festividades = uniformeFestividadeRepository.findByAtivoTrue();
        List<UniformePandeiro> pandeiros = uniformePandeiroRepository.findByAtivoTrue();

        BigDecimal totalEntradas = movimentos.stream()
                .filter(m -> m.getTipo() == TipoMovimento.ENTRADA)
                .map(MovimentoCaixa::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalSaidas = movimentos.stream()
                .filter(m -> m.getTipo() == TipoMovimento.SAIDA)
                .map(MovimentoCaixa::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalUniformeFestividade = festividades.stream()
                .map(UniformeFestividade::getTotalPago)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalUniformePandeiro = pandeiros.stream()
                .map(UniformePandeiro::getTotalPago)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DashboardResponseDTO.builder()
                .totalEntradas(totalEntradas)
                .totalSaidas(totalSaidas)
                .saldoAtual(totalEntradas.subtract(totalSaidas))
                .totalCongregacoes(congregacaoRepository.countByAtivoTrue())
                .totalMulheres(mulherRepository.countByAtivoTrue())
                .totalUniformeFestividade(totalUniformeFestividade)
                .totalUniformePandeiro(totalUniformePandeiro)
                .build();
    }
}
