package com.ufads.tesouraria.event;

import com.ufads.tesouraria.entity.MovimentoCaixa;
import com.ufads.tesouraria.enums.TipoMovimento;
import com.ufads.tesouraria.repository.MovimentoCaixaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CaixaEventListener {

    private final MovimentoCaixaRepository movimentoCaixaRepository;

    @EventListener
    public void aoReceberPagamentoUniforme(PagamentoUniformeRealizadoEvent event) {

        MovimentoCaixa movimento = MovimentoCaixa.builder()
                .data(event.getData())
                .tipo(TipoMovimento.ENTRADA)
                .descricao(event.getDescricao())
                .categoria(event.getCategoria())
                .formaPagamento(event.getFormaPagamento())
                .valor(event.getValor())
                .valorPix(event.getValorPix())
                .valorDinheiro(event.getValorDinheiro())
                .observacao(event.getObservacao())
                .ativo(true)
                .build();

        movimentoCaixaRepository.save(movimento);
    }
}
