package com.ufads.tesouraria.event;

import com.ufads.tesouraria.entity.MovimentoCaixa;
import com.ufads.tesouraria.enums.TipoMovimento;
import com.ufads.tesouraria.repository.MovimentoCaixaRepository;
import com.ufads.tesouraria.service.HistoricoAlteracaoService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class CaixaEventListener {

    private static final Logger logger = LoggerFactory.getLogger(CaixaEventListener.class);

    private final MovimentoCaixaRepository movimentoCaixaRepository;
    private final HistoricoAlteracaoService historicoService;

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

        MovimentoCaixa salvo = movimentoCaixaRepository.save(movimento);
        historicoService.registrar("MovimentoCaixa", salvo.getId(), "BAIXA_AUTOMATICA", "Baixa automatica gerada por " + event.getCategoria());
        logger.info("event=baixa_automatica movimentoId={} categoria={} valor={}", salvo.getId(), event.getCategoria(), event.getValor());
    }
}
