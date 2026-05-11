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
        LocalDate data = event.getData() == null ? LocalDate.now() : event.getData();
        BigDecimal valorPix = event.getValorPix() == null ? BigDecimal.ZERO : event.getValorPix();
        BigDecimal valorDinheiro = event.getValorDinheiro() == null ? BigDecimal.ZERO : event.getValorDinheiro();

        boolean jaExiste = movimentoCaixaRepository
                .findByDataAndTipoAndDescricaoAndCategoriaAndAtivoTrue(
                        data,
                        TipoMovimento.ENTRADA,
                        event.getDescricao(),
                        event.getCategoria()
                )
                .stream()
                .anyMatch(movimento ->
                        valoresIguais(movimento.getValor(), event.getValor())
                                && movimento.getFormaPagamento() == event.getFormaPagamento()
                                && valoresIguais(movimento.getValorPix(), valorPix)
                                && valoresIguais(movimento.getValorDinheiro(), valorDinheiro)
                );

        if (jaExiste) {
            logger.warn("event=baixa_automatica_duplicada_ignorada categoria={} descricao={} valor={}",
                    event.getCategoria(), event.getDescricao(), event.getValor());
            return;
        }

        MovimentoCaixa movimento = MovimentoCaixa.builder()
                .data(data)
                .tipo(TipoMovimento.ENTRADA)
                .descricao(event.getDescricao())
                .categoria(event.getCategoria())
                .formaPagamento(event.getFormaPagamento())
                .valor(event.getValor())
                .valorPix(valorPix)
                .valorDinheiro(valorDinheiro)
                .observacao(event.getObservacao())
                .ativo(true)
                .build();

        MovimentoCaixa salvo = movimentoCaixaRepository.save(movimento);
        historicoService.registrar("MovimentoCaixa", salvo.getId(), "BAIXA_AUTOMATICA", "Baixa automatica gerada por " + event.getCategoria());
        logger.info("event=baixa_automatica movimentoId={} categoria={} valor={}", salvo.getId(), event.getCategoria(), event.getValor());
    }

    private boolean valoresIguais(BigDecimal atual, BigDecimal esperado) {
        BigDecimal valorAtual = atual == null ? BigDecimal.ZERO : atual;
        BigDecimal valorEsperado = esperado == null ? BigDecimal.ZERO : esperado;
        return valorAtual.compareTo(valorEsperado) == 0;
    }
}
