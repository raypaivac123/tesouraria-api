package com.ufads.tesouraria.service;

import com.ufads.tesouraria.dto.VendaRequestDTO;
import com.ufads.tesouraria.entity.LoteVenda;
import com.ufads.tesouraria.entity.Venda;
import com.ufads.tesouraria.enums.FormaPagamento;
import com.ufads.tesouraria.event.PagamentoUniformeRealizadoEvent;
import com.ufads.tesouraria.exception.ResourceNotFoundException;
import com.ufads.tesouraria.repository.VendaRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VendaService {

    private static final Logger logger = LoggerFactory.getLogger(VendaService.class);

    private final VendaRepository repository;
    private final LoteVendaService loteVendaService;
    private final ApplicationEventPublisher publisher;
    private final HistoricoAlteracaoService historicoService;

    public Venda criar(VendaRequestDTO dto) {
        LoteVenda lote = loteVendaService.buscarPorId(dto.getLoteVendaId());

        Venda entity = Venda.builder()
                .comprador(dto.getComprador())
                .loteVenda(lote)
                .quantidade(dto.getQuantidade())
                .formaPagamento(dto.getFormaPagamento())
                .observacao(dto.getObservacao())
                .ativo(true)
                .build();

        preencherTotais(entity, lote, dto);

        Venda salva = repository.save(entity);
        historicoService.registrar("Venda", salva.getId(), "CRIACAO", "Venda criada para " + salva.getComprador());
        logger.info("event=venda_criada vendaId={} comprador={} valorPago={}", salva.getId(), salva.getComprador(), salva.getValorPago());

        if (salva.getValorPago().compareTo(BigDecimal.ZERO) > 0) {
            publisher.publishEvent(
                    new PagamentoUniformeRealizadoEvent(
                            "Venda - " + dto.getComprador(),
                            "venda",
                            dto.getFormaPagamento(),
                            salva.getValorPago(),
                            salva.getValorPix(),
                            salva.getValorDinheiro(),
                            lote.getDataVenda(),
                            dto.getObservacao()
                    )
            );
        }

        return salva;
    }

    public List<Venda> listar() {
        return repository.findByAtivoTrue();
    }

    public Venda buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venda nao encontrada"));
    }

    public Venda atualizar(Long id, VendaRequestDTO dto) {
        Venda entity = buscarPorId(id);
        LoteVenda lote = loteVendaService.buscarPorId(dto.getLoteVendaId());

        entity.setComprador(dto.getComprador());
        entity.setLoteVenda(lote);
        entity.setQuantidade(dto.getQuantidade());
        entity.setFormaPagamento(dto.getFormaPagamento());
        entity.setObservacao(dto.getObservacao());

        preencherTotais(entity, lote, dto);

        Venda salva = repository.save(entity);
        historicoService.registrar("Venda", salva.getId(), "ATUALIZACAO", "Venda atualizada para " + salva.getComprador());
        logger.info("event=venda_atualizada vendaId={} comprador={} valorPago={}", salva.getId(), salva.getComprador(), salva.getValorPago());
        return salva;
    }

    public void desativar(Long id) {
        Venda entity = buscarPorId(id);
        entity.setAtivo(false);
        repository.save(entity);
        historicoService.registrar("Venda", entity.getId(), "EXCLUSAO", "Venda desativada para " + entity.getComprador());
        logger.info("event=venda_desativada vendaId={}", entity.getId());
    }

    private void preencherTotais(Venda entity, LoteVenda lote, VendaRequestDTO dto) {
        BigDecimal total = lote.getValorUnitario().multiply(BigDecimal.valueOf(dto.getQuantidade()));
        BigDecimal custoUnitario = lote.getCustoUnitario() == null ? BigDecimal.ZERO : lote.getCustoUnitario();
        BigDecimal custoTotal = custoUnitario.multiply(BigDecimal.valueOf(dto.getQuantidade()));
        BigDecimal lucroPrevisto = total.subtract(custoTotal);
        BigDecimal valorPix = dto.getValorPix() == null ? BigDecimal.ZERO : dto.getValorPix();
        BigDecimal valorDinheiro = dto.getValorDinheiro() == null ? BigDecimal.ZERO : dto.getValorDinheiro();
        BigDecimal valorPago = dto.getValorPago() == null ? BigDecimal.ZERO : dto.getValorPago();
        Integer numeroParcelas = dto.getNumeroParcelas() == null ? 1 : dto.getNumeroParcelas();
        Integer parcelaAtual = dto.getParcelaAtual() == null ? 1 : dto.getParcelaAtual();

        if (dto.getFormaPagamento() == FormaPagamento.PIX) {
            valorPix = valorPago;
            valorDinheiro = BigDecimal.ZERO;
        } else if (dto.getFormaPagamento() == FormaPagamento.DINHEIRO) {
            valorPix = BigDecimal.ZERO;
            valorDinheiro = valorPago;
        } else {
            valorPago = valorPix.add(valorDinheiro);
        }

        BigDecimal pendente = total.subtract(valorPago);

        if (pendente.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Valor pago nao pode ser maior que o total da venda");
        }

        validarParcelas(numeroParcelas, parcelaAtual);

        entity.setTotal(total);
        entity.setCustoTotal(custoTotal);
        entity.setLucroPrevisto(lucroPrevisto);
        entity.setValorPago(valorPago);
        entity.setValorPix(valorPix);
        entity.setValorDinheiro(valorDinheiro);
        entity.setPendente(pendente);
        entity.setStatusPagamento(definirStatus(valorPago, total));
        entity.setNumeroParcelas(numeroParcelas);
        entity.setParcelaAtual(parcelaAtual);
    }

    private String definirStatus(BigDecimal pago, BigDecimal total) {
        if (pago.compareTo(BigDecimal.ZERO) == 0) return "PENDENTE";
        if (pago.compareTo(total) < 0) return "PAGO_PARCIAL";
        return "PAGO";
    }

    private void validarParcelas(Integer numeroParcelas, Integer parcelaAtual) {
        if (numeroParcelas < 1) {
            throw new RuntimeException("numeroParcelas deve ser maior ou igual a 1");
        }
        if (parcelaAtual < 1 || parcelaAtual > numeroParcelas) {
            throw new RuntimeException("parcelaAtual deve estar entre 1 e numeroParcelas");
        }
    }
}
