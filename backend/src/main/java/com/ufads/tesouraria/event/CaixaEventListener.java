package com.ufads.tesouraria.event;

import com.ufads.tesouraria.entity.MovimentoCaixa;
import com.ufads.tesouraria.enums.TipoMovimento;
import com.ufads.tesouraria.repository.MovimentoCaixaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class CaixaEventListener {

    private final MovimentoCaixaRepository movimentoCaixaRepository;

    @EventListener
    public void aoReceberPagamentoUniforme(PagamentoUniformeRealizadoEvent event) {

        MovimentoCaixa movimento = MovimentoCaixa.builder()
                .data(event.getData() == null ? LocalDate.now() : event.getData())
                .tipo(TipoMovimento.ENTRADA)
                .descricao(event.getDescricao())
                .categoria(event.getCategoria())
                .formaPagamento(event.getFormaPagamento())
                .valor(event.getValor())
                .valorPix(event.getValorPix() == null ? BigDecimal.ZERO : event.getValorPix())
                .valorDinheiro(event.getValorDinheiro() == null ? BigDecimal.ZERO : event.getValorDinheiro())
                .observacao(event.getObservacao())
                .ativo(true)
                .build();

        movimentoCaixaRepository.save(movimento);
    }
}
