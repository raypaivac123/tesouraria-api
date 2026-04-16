package com.ufads.tesouraria.service;

import com.ufads.tesouraria.dto.VendaRequestDTO;
import com.ufads.tesouraria.entity.LoteVenda;
import com.ufads.tesouraria.entity.Venda;
import com.ufads.tesouraria.enums.FormaPagamento;
import com.ufads.tesouraria.event.PagamentoUniformeRealizadoEvent;
import com.ufads.tesouraria.exception.ResourceNotFoundException;
import com.ufads.tesouraria.repository.VendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VendaService {

    private final VendaRepository repository;
    private final LoteVendaService loteVendaService;
    private final ApplicationEventPublisher publisher;

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

        if (salva.getValorPago().compareTo(BigDecimal.ZERO) > 0) {
            publisher.publishEvent(
                    new PagamentoUniformeRealizadoEvent(
                            "Venda - " + dto.getComprador(),
                            "venda",
                            dto.getFormaPagamento(),
                            salva.getValorPago(),
                            dto.getFormaPagamento() == FormaPagamento.PIX || dto.getFormaPagamento() == FormaPagamento.MISTO ? salva.getValorPago() : BigDecimal.ZERO,
                            dto.getFormaPagamento() == FormaPagamento.DINHEIRO ? salva.getValorPago() : BigDecimal.ZERO,
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

        return repository.save(entity);
    }

    public void desativar(Long id) {
        Venda entity = buscarPorId(id);
        entity.setAtivo(false);
        repository.save(entity);
    }

    private void preencherTotais(Venda entity, LoteVenda lote, VendaRequestDTO dto) {
        BigDecimal total = lote.getValorUnitario().multiply(BigDecimal.valueOf(dto.getQuantidade()));
        BigDecimal custoUnitario = lote.getCustoUnitario() == null ? BigDecimal.ZERO : lote.getCustoUnitario();
        BigDecimal custoTotal = custoUnitario.multiply(BigDecimal.valueOf(dto.getQuantidade()));
        BigDecimal lucroPrevisto = total.subtract(custoTotal);
        BigDecimal valorPago = dto.getValorPago() == null ? BigDecimal.ZERO : dto.getValorPago();
        BigDecimal pendente = total.subtract(valorPago);

        if (pendente.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Valor pago nao pode ser maior que o total da venda");
        }

        entity.setTotal(total);
        entity.setCustoTotal(custoTotal);
        entity.setLucroPrevisto(lucroPrevisto);
        entity.setValorPago(valorPago);
        entity.setPendente(pendente);
        entity.setStatusPagamento(definirStatus(valorPago, total));
    }

    private String definirStatus(BigDecimal pago, BigDecimal total) {
        if (pago.compareTo(BigDecimal.ZERO) == 0) return "PENDENTE";
        if (pago.compareTo(total) < 0) return "PAGO_PARCIAL";
        return "PAGO";
    }
}
