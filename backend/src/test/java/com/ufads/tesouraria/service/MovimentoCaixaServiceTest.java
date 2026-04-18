package com.ufads.tesouraria.service;

import com.ufads.tesouraria.dto.MovimentoCaixaRequestDTO;
import com.ufads.tesouraria.entity.MovimentoCaixa;
import com.ufads.tesouraria.enums.FormaPagamento;
import com.ufads.tesouraria.enums.TipoMovimento;
import com.ufads.tesouraria.repository.MovimentoCaixaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MovimentoCaixaServiceTest {

    @Mock
    private MovimentoCaixaRepository repository;

    @Mock
    private HistoricoAlteracaoService historicoService;

    @InjectMocks
    private MovimentoCaixaService service;

    @Test
    void devePreencherValorPixQuandoFormaPagamentoForPix() {
        MovimentoCaixaRequestDTO dto = MovimentoCaixaRequestDTO.builder()
                .data(LocalDate.now())
                .tipo(TipoMovimento.ENTRADA)
                .descricao("Entrada")
                .categoria("teste")
                .formaPagamento(FormaPagamento.PIX)
                .valor(new BigDecimal("25.00"))
                .build();

        when(repository.save(any(MovimentoCaixa.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MovimentoCaixa movimento = service.criar(dto);

        assertThat(movimento.getValorPix()).isEqualByComparingTo("25.00");
        assertThat(movimento.getValorDinheiro()).isNull();
    }

    @Test
    void naoDevePermitirPagamentoMistoComSomaDiferenteDoTotal() {
        MovimentoCaixaRequestDTO dto = MovimentoCaixaRequestDTO.builder()
                .data(LocalDate.now())
                .tipo(TipoMovimento.ENTRADA)
                .descricao("Entrada")
                .categoria("teste")
                .formaPagamento(FormaPagamento.MISTO)
                .valor(new BigDecimal("50.00"))
                .valorPix(new BigDecimal("20.00"))
                .valorDinheiro(new BigDecimal("20.00"))
                .build();

        assertThatThrownBy(() -> service.criar(dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("valorPix + valorDinheiro");
    }

    @Test
    void saidaDeveTerJustificativa() {
        MovimentoCaixaRequestDTO dto = MovimentoCaixaRequestDTO.builder()
                .data(LocalDate.now())
                .tipo(TipoMovimento.SAIDA)
                .descricao("Saida")
                .categoria("teste")
                .formaPagamento(FormaPagamento.DINHEIRO)
                .valor(new BigDecimal("10.00"))
                .build();

        assertThatThrownBy(() -> service.criar(dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Justificativa");
    }
}
