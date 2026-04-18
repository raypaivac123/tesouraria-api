package com.ufads.tesouraria.service;

import com.ufads.tesouraria.dto.VendaRequestDTO;
import com.ufads.tesouraria.entity.LoteVenda;
import com.ufads.tesouraria.entity.Venda;
import com.ufads.tesouraria.enums.FormaPagamento;
import com.ufads.tesouraria.repository.VendaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VendaServiceTest {

    @Mock
    private VendaRepository repository;

    @Mock
    private LoteVendaService loteVendaService;

    @Mock
    private ApplicationEventPublisher publisher;

    @Mock
    private HistoricoAlteracaoService historicoService;

    @InjectMocks
    private VendaService service;

    @Test
    void deveCalcularTotaisDaVenda() {
        LoteVenda lote = LoteVenda.builder()
                .id(1L)
                .produto("Uniforme")
                .dataVenda(LocalDate.now())
                .valorUnitario(new BigDecimal("50.00"))
                .custoUnitario(new BigDecimal("30.00"))
                .build();

        VendaRequestDTO dto = VendaRequestDTO.builder()
                .comprador("Maria")
                .loteVendaId(1L)
                .quantidade(2)
                .valorPago(new BigDecimal("60.00"))
                .formaPagamento(FormaPagamento.PIX)
                .build();

        when(loteVendaService.buscarPorId(1L)).thenReturn(lote);
        when(repository.save(any(Venda.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Venda venda = service.criar(dto);

        assertThat(venda.getTotal()).isEqualByComparingTo("100.00");
        assertThat(venda.getCustoTotal()).isEqualByComparingTo("60.00");
        assertThat(venda.getLucroPrevisto()).isEqualByComparingTo("40.00");
        assertThat(venda.getPendente()).isEqualByComparingTo("40.00");
        assertThat(venda.getStatusPagamento()).isEqualTo("PAGO_PARCIAL");
    }

    @Test
    void naoDevePermitirValorPagoMaiorQueTotal() {
        LoteVenda lote = LoteVenda.builder()
                .id(1L)
                .valorUnitario(new BigDecimal("50.00"))
                .custoUnitario(BigDecimal.ZERO)
                .build();

        VendaRequestDTO dto = VendaRequestDTO.builder()
                .comprador("Maria")
                .loteVendaId(1L)
                .quantidade(1)
                .valorPago(new BigDecimal("70.00"))
                .formaPagamento(FormaPagamento.PIX)
                .build();

        when(loteVendaService.buscarPorId(1L)).thenReturn(lote);

        assertThatThrownBy(() -> service.criar(dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Valor pago");
    }
}
