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
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final MovimentoCaixaRepository movimentoCaixaRepository;
    private final CongregacaoRepository congregacaoRepository;
    private final MulherRepository mulherRepository;
    private final UniformeFestividadeRepository uniformeFestividadeRepository;
    private final UniformePandeiroRepository uniformePandeiroRepository;

    public DashboardResponseDTO obterResumo() {
        return obterResumo(null, null, null);
    }

    public DashboardResponseDTO obterResumo(LocalDate dataInicial, LocalDate dataFinal, Long congregacaoId) {

        List<MovimentoCaixa> movimentos = movimentoCaixaRepository.findByAtivoTrue();
        List<UniformeFestividade> festividades = uniformeFestividadeRepository.findByAtivoTrue();
        List<UniformePandeiro> pandeiros = uniformePandeiroRepository.findByAtivoTrue();

        if (dataInicial != null && dataFinal != null) {
            movimentos = movimentos.stream()
                    .filter(m -> !m.getData().isBefore(dataInicial) && !m.getData().isAfter(dataFinal))
                    .toList();

            festividades = festividades.stream()
                    .filter(f -> estaNoPeriodo(f.getDataPagamento(), dataInicial, dataFinal))
                    .toList();

            pandeiros = pandeiros.stream()
                    .filter(p -> estaNoPeriodo(p.getDataPagamento(), dataInicial, dataFinal))
                    .toList();
        }

        if (congregacaoId != null) {
            festividades = festividades.stream()
                    .filter(f -> Objects.equals(f.getCongregacao().getId(), congregacaoId))
                    .toList();

            pandeiros = pandeiros.stream()
                    .filter(p -> Objects.equals(p.getCongregacao().getId(), congregacaoId))
                    .toList();
        }

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

        BigDecimal totalPendenteUniformeFestividade = festividades.stream()
                .map(UniformeFestividade::getSaldoPendente)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPendenteUniformePandeiro = pandeiros.stream()
                .map(UniformePandeiro::getSaldoPendente)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DashboardResponseDTO.builder()
                .totalEntradas(totalEntradas)
                .totalSaidas(totalSaidas)
                .saldoAtual(totalEntradas.subtract(totalSaidas))
                .totalCongregacoes(congregacaoRepository.countByAtivoTrue())
                .totalMulheres(mulherRepository.countByAtivoTrue())
                .totalUniformeFestividade(totalUniformeFestividade)
                .totalUniformePandeiro(totalUniformePandeiro)
                .totalPendenteUniformeFestividade(totalPendenteUniformeFestividade)
                .totalPendenteUniformePandeiro(totalPendenteUniformePandeiro)
                .totalArrecadadoUniformes(totalUniformeFestividade.add(totalUniformePandeiro))
                .totalPendenteUniformes(totalPendenteUniformeFestividade.add(totalPendenteUniformePandeiro))
                .totalRegistrosUniformes((long) festividades.size() + pandeiros.size())
                .build();
    }

    private boolean estaNoPeriodo(LocalDate data, LocalDate dataInicial, LocalDate dataFinal) {
        return data != null && !data.isBefore(dataInicial) && !data.isAfter(dataFinal);
    }
}
