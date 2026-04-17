package com.ufads.tesouraria.service;

import com.ufads.tesouraria.dto.RelatorioFinanceiroDTO;
import com.ufads.tesouraria.entity.Congregacao;
import com.ufads.tesouraria.entity.MovimentoCaixa;
import com.ufads.tesouraria.entity.UniformeFestividade;
import com.ufads.tesouraria.entity.UniformePandeiro;
import com.ufads.tesouraria.enums.TipoMovimento;
import com.ufads.tesouraria.exception.ResourceNotFoundException;
import com.ufads.tesouraria.mapper.MovimentoCaixaMapper;
import com.ufads.tesouraria.mapper.UniformeFestividadeMapper;
import com.ufads.tesouraria.mapper.UniformePandeiroMapper;
import com.ufads.tesouraria.repository.CongregacaoRepository;
import com.ufads.tesouraria.repository.MovimentoCaixaRepository;
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
public class RelatorioService {

    private final MovimentoCaixaRepository movimentoCaixaRepository;
    private final UniformeFestividadeRepository uniformeFestividadeRepository;
    private final UniformePandeiroRepository uniformePandeiroRepository;
    private final CongregacaoRepository congregacaoRepository;

    public RelatorioFinanceiroDTO gerarFinanceiro(
            LocalDate dataInicial,
            LocalDate dataFinal,
            Long congregacaoId
    ) {
        validarPeriodo(dataInicial, dataFinal);

        Congregacao congregacao = null;
        if (congregacaoId != null) {
            congregacao = congregacaoRepository.findById(congregacaoId)
                    .orElseThrow(() -> new ResourceNotFoundException("Congregacao nao encontrada"));
        }

        List<MovimentoCaixa> movimentos = movimentoCaixaRepository.findByAtivoTrue()
                .stream()
                .filter(m -> estaNoPeriodo(m.getData(), dataInicial, dataFinal))
                .toList();

        List<UniformeFestividade> uniformesFestividade = uniformeFestividadeRepository.findByAtivoTrue()
                .stream()
                .filter(u -> estaNoPeriodo(u.getDataPagamento(), dataInicial, dataFinal))
                .filter(u -> congregacaoId == null || Objects.equals(u.getCongregacao().getId(), congregacaoId))
                .toList();

        List<UniformePandeiro> uniformesPandeiro = uniformePandeiroRepository.findByAtivoTrue()
                .stream()
                .filter(u -> estaNoPeriodo(u.getDataPagamento(), dataInicial, dataFinal))
                .filter(u -> congregacaoId == null || Objects.equals(u.getCongregacao().getId(), congregacaoId))
                .toList();

        BigDecimal totalEntradas = somarMovimentos(movimentos, TipoMovimento.ENTRADA);
        BigDecimal totalSaidas = somarMovimentos(movimentos, TipoMovimento.SAIDA);
        BigDecimal totalFestividade = somarFestividade(uniformesFestividade, false);
        BigDecimal pendenteFestividade = somarFestividade(uniformesFestividade, true);
        BigDecimal totalPandeiro = somarPandeiro(uniformesPandeiro, false);
        BigDecimal pendentePandeiro = somarPandeiro(uniformesPandeiro, true);

        return RelatorioFinanceiroDTO.builder()
                .dataInicial(dataInicial)
                .dataFinal(dataFinal)
                .congregacaoId(congregacaoId)
                .nomeCongregacao(congregacao == null ? null : congregacao.getNome())
                .totalEntradas(totalEntradas)
                .totalSaidas(totalSaidas)
                .saldoCaixa(totalEntradas.subtract(totalSaidas))
                .totalUniformeFestividade(totalFestividade)
                .totalUniformePandeiro(totalPandeiro)
                .totalArrecadadoUniformes(totalFestividade.add(totalPandeiro))
                .totalPendenteUniformes(pendenteFestividade.add(pendentePandeiro))
                .totalMovimentos((long) movimentos.size())
                .totalUniformesFestividade((long) uniformesFestividade.size())
                .totalUniformesPandeiro((long) uniformesPandeiro.size())
                .movimentos(movimentos.stream().map(MovimentoCaixaMapper::toResponseDTO).toList())
                .uniformesFestividade(uniformesFestividade.stream().map(UniformeFestividadeMapper::toResponseDTO).toList())
                .uniformesPandeiro(uniformesPandeiro.stream().map(UniformePandeiroMapper::toResponseDTO).toList())
                .build();
    }

    public String gerarCsv(LocalDate dataInicial, LocalDate dataFinal, Long congregacaoId) {
        RelatorioFinanceiroDTO relatorio = gerarFinanceiro(dataInicial, dataFinal, congregacaoId);

        StringBuilder csv = new StringBuilder();
        csv.append("campo;valor\n");
        csv.append("dataInicial;").append(valor(relatorio.getDataInicial())).append("\n");
        csv.append("dataFinal;").append(valor(relatorio.getDataFinal())).append("\n");
        csv.append("congregacao;").append(valor(relatorio.getNomeCongregacao())).append("\n");
        csv.append("totalEntradas;").append(relatorio.getTotalEntradas()).append("\n");
        csv.append("totalSaidas;").append(relatorio.getTotalSaidas()).append("\n");
        csv.append("saldoCaixa;").append(relatorio.getSaldoCaixa()).append("\n");
        csv.append("totalUniformeFestividade;").append(relatorio.getTotalUniformeFestividade()).append("\n");
        csv.append("totalUniformePandeiro;").append(relatorio.getTotalUniformePandeiro()).append("\n");
        csv.append("totalArrecadadoUniformes;").append(relatorio.getTotalArrecadadoUniformes()).append("\n");
        csv.append("totalPendenteUniformes;").append(relatorio.getTotalPendenteUniformes()).append("\n");
        csv.append("totalMovimentos;").append(relatorio.getTotalMovimentos()).append("\n");
        csv.append("totalUniformesFestividade;").append(relatorio.getTotalUniformesFestividade()).append("\n");
        csv.append("totalUniformesPandeiro;").append(relatorio.getTotalUniformesPandeiro()).append("\n");

        return csv.toString();
    }

    private void validarPeriodo(LocalDate dataInicial, LocalDate dataFinal) {
        if (dataInicial == null || dataFinal == null) {
            throw new RuntimeException("dataInicial e dataFinal sao obrigatorias");
        }

        if (dataFinal.isBefore(dataInicial)) {
            throw new RuntimeException("dataFinal nao pode ser anterior a dataInicial");
        }
    }

    private boolean estaNoPeriodo(LocalDate data, LocalDate dataInicial, LocalDate dataFinal) {
        return data != null && !data.isBefore(dataInicial) && !data.isAfter(dataFinal);
    }

    private BigDecimal somarMovimentos(List<MovimentoCaixa> movimentos, TipoMovimento tipo) {
        return movimentos.stream()
                .filter(m -> m.getTipo() == tipo)
                .map(MovimentoCaixa::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal somarFestividade(List<UniformeFestividade> uniformes, boolean pendente) {
        return uniformes.stream()
                .map(uniforme -> pendente ? uniforme.getSaldoPendente() : uniforme.getTotalPago())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal somarPandeiro(List<UniformePandeiro> uniformes, boolean pendente) {
        return uniformes.stream()
                .map(uniforme -> pendente ? uniforme.getSaldoPendente() : uniforme.getTotalPago())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String valor(Object valor) {
        return valor == null ? "" : valor.toString();
    }
}
