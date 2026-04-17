package com.ufads.tesouraria.service;

import com.ufads.tesouraria.dto.ResumoUniformeDTO;
import com.ufads.tesouraria.dto.UniformePandeiroRequestDTO;
import com.ufads.tesouraria.entity.Congregacao;
import com.ufads.tesouraria.entity.UniformePandeiro;
import com.ufads.tesouraria.enums.FormaPagamento;
import com.ufads.tesouraria.enums.StatusPagamento;
import com.ufads.tesouraria.event.PagamentoUniformeRealizadoEvent;
import com.ufads.tesouraria.exception.ResourceNotFoundException;
import com.ufads.tesouraria.repository.CongregacaoRepository;
import com.ufads.tesouraria.repository.UniformePandeiroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UniformePandeiroService {

    private final UniformePandeiroRepository repository;
    private final CongregacaoRepository congregacaoRepository;
    private final ApplicationEventPublisher publisher;

    public UniformePandeiro criar(UniformePandeiroRequestDTO dto) {

        Congregacao congregacao = congregacaoRepository.findById(dto.getCongregacaoId())
                .orElseThrow(() -> new ResourceNotFoundException("Congregação não encontrada"));

        BigDecimal valorPix = dto.getValorPix() == null ? BigDecimal.ZERO : dto.getValorPix();
        BigDecimal valorDinheiro = dto.getValorDinheiro() == null ? BigDecimal.ZERO : dto.getValorDinheiro();

        BigDecimal totalPago = valorPix.add(valorDinheiro);
        BigDecimal saldoPendente = dto.getValorUniforme().subtract(totalPago);

        if (saldoPendente.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Valor pago maior que o valor do uniforme");
        }

        StatusPagamento status = definirStatus(totalPago, dto.getValorUniforme());

        UniformePandeiro entity = UniformePandeiro.builder()
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
                            "Pagamento uniforme pandeiro - " + dto.getNomeMulher(),
                            "uniforme_pandeiro",
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

    public List<UniformePandeiro> listar() {
        return repository.findByAtivoTrue();
    }

    public ResumoUniformeDTO obterResumo() {
        List<UniformePandeiro> lista = repository.findByAtivoTrue();

        BigDecimal totalArrecadado = lista.stream()
                .map(UniformePandeiro::getTotalPago)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPendente = lista.stream()
                .map(UniformePandeiro::getSaldoPendente)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ResumoUniformeDTO.builder()
                .totalArrecadado(totalArrecadado)
                .totalPendente(totalPendente)
                .totalRegistros((long) lista.size())
                .build();
    }

    public UniformePandeiro buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Uniforme não encontrado"));
    }

    public UniformePandeiro atualizar(Long id, UniformePandeiroRequestDTO dto) {

        UniformePandeiro entity = buscarPorId(id);

        Congregacao congregacao = congregacaoRepository.findById(dto.getCongregacaoId())
                .orElseThrow(() -> new ResourceNotFoundException("Congregação não encontrada"));

        BigDecimal valorPix = dto.getValorPix() == null ? BigDecimal.ZERO : dto.getValorPix();
        BigDecimal valorDinheiro = dto.getValorDinheiro() == null ? BigDecimal.ZERO : dto.getValorDinheiro();

        BigDecimal totalPago = valorPix.add(valorDinheiro);
        BigDecimal saldoPendente = dto.getValorUniforme().subtract(totalPago);

        if (saldoPendente.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Valor pago maior que o valor do uniforme");
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

        UniformePandeiro entity = buscarPorId(id);

        entity.setAtivo(false);

        repository.save(entity);
    }

    private StatusPagamento definirStatus(BigDecimal pago, BigDecimal valor) {

        if (pago.compareTo(BigDecimal.ZERO) == 0)
            return StatusPagamento.NAO_PAGO;

        if (pago.compareTo(valor) < 0)
            return StatusPagamento.PAGO_PARCIALMENTE;

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
