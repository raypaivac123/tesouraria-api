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

        BigDecimal total = lote.getValorUnitario().multiply(BigDecimal.valueOf(dto.getQuantidade()));
        BigDecimal custoUnitario = lote.getCustoUnitario() == null ? BigDecimal.ZERO : lote.getCustoUnitario();
        BigDecimal custoTotal = custoUnitario.multiply(BigDecimal.valueOf(dto.getQuantidade()));
        BigDecimal lucroPrevisto = total.subtract(custoTotal);
        BigDecimal valorPago = dto.getValorPago() == null ? BigDecimal.ZERO : dto.getValorPago();
        BigDecimal pendente = total.subtract(valorPago);

        if (pendente.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Valor pago não pode ser maior que o total da venda");
        }

        String status = definirStatus(valorPago, total);

        Venda entity = Venda.builder()
                .comprador(dto.getComprador())
                .loteVenda(lote)
                .quantidade(dto.getQuantidade())
                .total(total)
                .custoTotal(custoTotal)
                .lucroPrevisto(lucroPrevisto)
                .valorPago(valorPago)
                .pendente(pendente)
                .formaPagamento(dto.getFormaPagamento())
                .statusPagamento(status)
                .observacao(dto.getObservacao())
                .ativo(true)
                .build();

        Venda salva = repository.save(entity);

        if (valorPago.compareTo(BigDecimal.ZERO) > 0) {
            publisher.publishEvent(
                    new PagamentoUniformeRealizadoEvent(
                            "Venda - " + dto.getComprador(),
                            "venda",
                            dto.getFormaPagamento(),
                            valorPago,
                            dto.getFormaPagamento() == FormaPagamento.PIX || dto.getFormaPagamento() == FormaPagamento.MISTO ? valorPago : BigDecimal.ZERO,
                            dto.getFormaPagamento() == FormaPagamento.DINHEIRO ? valorPago : BigDecimal.ZERO,
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
                .orElseThrow(() -> new ResourceNotFoundException("Venda não encontrada"));
    }

    public void desativar(Long id) {
        Venda entity = buscarPorId(id);
        entity.setAtivo(false);
        repository.save(entity);
    }

    private String definirStatus(BigDecimal pago, BigDecimal total) {
        if (pago.compareTo(BigDecimal.ZERO) == 0) return "PENDENTE";
        if (pago.compareTo(total) < 0) return "PAGO_PARCIAL";
        return "PAGO";
    }
}
