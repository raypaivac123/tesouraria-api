package com.ufads.tesouraria.service;

import com.ufads.tesouraria.dto.ResumoUniformeDTO;
import com.ufads.tesouraria.dto.UniformeFestividadeRequestDTO;
import com.ufads.tesouraria.entity.Congregacao;
import com.ufads.tesouraria.entity.UniformeFestividade;
import com.ufads.tesouraria.enums.FormaPagamento;
import com.ufads.tesouraria.enums.StatusPagamento;
import com.ufads.tesouraria.event.PagamentoUniformeRealizadoEvent;
import com.ufads.tesouraria.exception.ResourceNotFoundException;
import com.ufads.tesouraria.repository.CongregacaoRepository;
import com.ufads.tesouraria.repository.UniformeFestividadeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UniformeFestividadeService {

    private final UniformeFestividadeRepository repository;
    private final CongregacaoRepository congregacaoRepository;
    private final ApplicationEventPublisher publisher;

    public UniformeFestividade criar(UniformeFestividadeRequestDTO dto) {
        Congregacao congregacao = congregacaoRepository.findById(dto.getCongregacaoId())
                .orElseThrow(() -> new ResourceNotFoundException("Congregação não encontrada"));

        BigDecimal valorPix = dto.getValorPix() == null ? BigDecimal.ZERO : dto.getValorPix();
        BigDecimal valorDinheiro = dto.getValorDinheiro() == null ? BigDecimal.ZERO : dto.getValorDinheiro();
        BigDecimal totalPago = valorPix.add(valorDinheiro);
        BigDecimal saldoPendente = dto.getValorUniforme().subtract(totalPago);

        if (saldoPendente.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("O total pago não pode ser maior que o valor do uniforme");
        }

        StatusPagamento status = definirStatus(totalPago, dto.getValorUniforme());

        UniformeFestividade entity = UniformeFestividade.builder()
                .nomeMulher(dto.getNomeMulher())
                .telefone(dto.getTelefone())
                .congregacao(congregacao)
                .nomeUniforme(dto.getNomeUniforme())
                .valorUniforme(dto.getValorUniforme())
                .valorPix(valorPix)
                .valorDinheiro(valorDinheiro)
                .totalPago(totalPago)
                .saldoPendente(saldoPendente)
                .statusPagamento(status)
                .dataPagamento(dto.getDataPagamento())
                .observacao(dto.getObservacao())
                .ativo(true)
                .build();

        if (totalPago.compareTo(BigDecimal.ZERO) > 0) {
            publisher.publishEvent(
                    new PagamentoUniformeRealizadoEvent(
                            "Pagamento uniforme festividade - " + dto.getNomeMulher(),
                            "uniforme_festividade",
                            definirFormaPagamento(valorPix, valorDinheiro),
                            totalPago,
                            valorPix,
                            valorDinheiro,
                            dto.getDataPagamento(),
                            dto.getObservacao()
                    )
            );
        }

        return repository.save(entity);
    }

    public List<UniformeFestividade> listarAtivos() {
        return repository.findByAtivoTrue();
    }

    public ResumoUniformeDTO obterResumo() {
        List<UniformeFestividade> lista = repository.findByAtivoTrue();

        BigDecimal totalArrecadado = lista.stream()
                .map(UniformeFestividade::getTotalPago)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPendente = lista.stream()
                .map(UniformeFestividade::getSaldoPendente)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ResumoUniformeDTO.builder()
                .totalArrecadado(totalArrecadado)
                .totalPendente(totalPendente)
                .totalRegistros((long) lista.size())
                .build();
    }

    public UniformeFestividade buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro de uniforme festividade não encontrado"));
    }

    public UniformeFestividade atualizar(Long id, UniformeFestividadeRequestDTO dto) {
        UniformeFestividade entity = buscarPorId(id);

        Congregacao congregacao = congregacaoRepository.findById(dto.getCongregacaoId())
                .orElseThrow(() -> new ResourceNotFoundException("Congregação não encontrada"));

        BigDecimal valorPix = dto.getValorPix() == null ? BigDecimal.ZERO : dto.getValorPix();
        BigDecimal valorDinheiro = dto.getValorDinheiro() == null ? BigDecimal.ZERO : dto.getValorDinheiro();
        BigDecimal totalPago = valorPix.add(valorDinheiro);
        BigDecimal saldoPendente = dto.getValorUniforme().subtract(totalPago);

        if (saldoPendente.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("O total pago não pode ser maior que o valor do uniforme");
        }

        StatusPagamento status = definirStatus(totalPago, dto.getValorUniforme());

        entity.setNomeMulher(dto.getNomeMulher());
        entity.setTelefone(dto.getTelefone());
        entity.setCongregacao(congregacao);
        entity.setNomeUniforme(dto.getNomeUniforme());
        entity.setValorUniforme(dto.getValorUniforme());
        entity.setValorPix(valorPix);
        entity.setValorDinheiro(valorDinheiro);
        entity.setTotalPago(totalPago);
        entity.setSaldoPendente(saldoPendente);
        entity.setStatusPagamento(status);
        entity.setDataPagamento(dto.getDataPagamento());
        entity.setObservacao(dto.getObservacao());

        return repository.save(entity);
    }

    public void desativar(Long id) {
        UniformeFestividade entity = buscarPorId(id);
        entity.setAtivo(false);
        repository.save(entity);
    }

    private StatusPagamento definirStatus(BigDecimal totalPago, BigDecimal valorUniforme) {
        if (totalPago.compareTo(BigDecimal.ZERO) == 0) {
            return StatusPagamento.NAO_PAGO;
        }
        if (totalPago.compareTo(valorUniforme) < 0) {
            return StatusPagamento.PAGO_PARCIALMENTE;
        }
        return StatusPagamento.PAGO_INTEGRALMENTE;
    }

    private FormaPagamento definirFormaPagamento(BigDecimal valorPix, BigDecimal valorDinheiro) {
        boolean temPix = valorPix.compareTo(BigDecimal.ZERO) > 0;
        boolean temDinheiro = valorDinheiro.compareTo(BigDecimal.ZERO) > 0;

        if (temPix && temDinheiro) {
            return FormaPagamento.MISTO;
        }
        if (temPix) {
            return FormaPagamento.PIX;
        }
        return FormaPagamento.DINHEIRO;
    }
}
