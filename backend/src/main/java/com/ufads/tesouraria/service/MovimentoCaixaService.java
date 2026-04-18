package com.ufads.tesouraria.service;

import com.ufads.tesouraria.dto.MovimentoCaixaRequestDTO;
import com.ufads.tesouraria.dto.ResumoCaixaDTO;
import com.ufads.tesouraria.entity.MovimentoCaixa;
import com.ufads.tesouraria.enums.FormaPagamento;
import com.ufads.tesouraria.enums.TipoMovimento;
import com.ufads.tesouraria.exception.ResourceNotFoundException;
import com.ufads.tesouraria.repository.MovimentoCaixaRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MovimentoCaixaService {

    private static final Logger logger = LoggerFactory.getLogger(MovimentoCaixaService.class);

    private final MovimentoCaixaRepository repository;
    private final HistoricoAlteracaoService historicoService;

    public MovimentoCaixa criar(MovimentoCaixaRequestDTO dto) {
        validarRegras(dto);

        MovimentoCaixa movimento = MovimentoCaixa.builder()
                .data(dto.getData())
                .tipo(dto.getTipo())
                .descricao(dto.getDescricao())
                .categoria(dto.getCategoria())
                .formaPagamento(dto.getFormaPagamento())
                .valor(dto.getValor())
                .valorPix(dto.getValorPix())
                .valorDinheiro(dto.getValorDinheiro())
                .observacao(dto.getObservacao())
                .justificativa(dto.getJustificativa())
                .ativo(true)
                .build();

        MovimentoCaixa salvo = repository.save(movimento);
        historicoService.registrar("MovimentoCaixa", salvo.getId(), "CRIACAO", "Movimento criado: " + salvo.getDescricao());
        logger.info("event=movimento_caixa_criado movimentoId={} tipo={} valor={}", salvo.getId(), salvo.getTipo(), salvo.getValor());
        return salvo;
    }

    public List<MovimentoCaixa> listarAtivos() {
        return repository.findByAtivoTrue();
    }

    public MovimentoCaixa buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movimento de caixa não encontrado"));
    }

    public List<MovimentoCaixa> listarPorTipo(TipoMovimento tipo) {
        return repository.findByTipoAndAtivoTrue(tipo);
    }

    public List<MovimentoCaixa> listarPorPeriodo(LocalDate dataInicial, LocalDate dataFinal) {
        return repository.findByDataBetweenAndAtivoTrue(dataInicial, dataFinal);
    }

    public ResumoCaixaDTO obterResumo() {
        List<MovimentoCaixa> movimentos = repository.findByAtivoTrue();

        BigDecimal totalEntradas = movimentos.stream()
                .filter(m -> m.getTipo() == TipoMovimento.ENTRADA)
                .map(MovimentoCaixa::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalSaidas = movimentos.stream()
                .filter(m -> m.getTipo() == TipoMovimento.SAIDA)
                .map(MovimentoCaixa::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ResumoCaixaDTO.builder()
                .totalEntradas(totalEntradas)
                .totalSaidas(totalSaidas)
                .saldo(totalEntradas.subtract(totalSaidas))
                .build();
    }

    public List<MovimentoCaixa> listarPorPeriodoETipo(LocalDate dataInicial, LocalDate dataFinal, TipoMovimento tipo) {
        return repository.findByDataBetweenAndAtivoTrue(dataInicial, dataFinal)
                .stream()
                .filter(m -> tipo == null || m.getTipo() == tipo)
                .toList();
    }

    public MovimentoCaixa atualizar(Long id, MovimentoCaixaRequestDTO dto) {
        validarRegras(dto);

        MovimentoCaixa movimento = buscarPorId(id);

        movimento.setData(dto.getData());
        movimento.setTipo(dto.getTipo());
        movimento.setDescricao(dto.getDescricao());
        movimento.setCategoria(dto.getCategoria());
        movimento.setFormaPagamento(dto.getFormaPagamento());
        movimento.setValor(dto.getValor());
        movimento.setValorPix(dto.getValorPix());
        movimento.setValorDinheiro(dto.getValorDinheiro());
        movimento.setObservacao(dto.getObservacao());
        movimento.setJustificativa(dto.getJustificativa());

        MovimentoCaixa salvo = repository.save(movimento);
        historicoService.registrar("MovimentoCaixa", salvo.getId(), "ATUALIZACAO", "Movimento atualizado: " + salvo.getDescricao());
        logger.info("event=movimento_caixa_atualizado movimentoId={} tipo={} valor={}", salvo.getId(), salvo.getTipo(), salvo.getValor());
        return salvo;
    }

    public void desativar(Long id) {
        MovimentoCaixa movimento = buscarPorId(id);
        movimento.setAtivo(false);
        repository.save(movimento);
        historicoService.registrar("MovimentoCaixa", movimento.getId(), "EXCLUSAO", "Movimento desativado: " + movimento.getDescricao());
        logger.info("event=movimento_caixa_desativado movimentoId={}", movimento.getId());
    }

    private void validarRegras(MovimentoCaixaRequestDTO dto) {
        if (dto.getTipo() == TipoMovimento.SAIDA) {
            if (dto.getJustificativa() == null || dto.getJustificativa().isBlank()) {
                throw new RuntimeException("Justificativa é obrigatória para saídas");
            }
        }

        if (dto.getFormaPagamento() == FormaPagamento.MISTO) {
            BigDecimal pix = dto.getValorPix() == null ? BigDecimal.ZERO : dto.getValorPix();
            BigDecimal dinheiro = dto.getValorDinheiro() == null ? BigDecimal.ZERO : dto.getValorDinheiro();
            BigDecimal total = pix.add(dinheiro);

            if (dto.getValor() == null || total.compareTo(dto.getValor()) != 0) {
                throw new RuntimeException("No pagamento misto, valorPix + valorDinheiro deve ser igual ao valor total");
            }
        }

        if (dto.getFormaPagamento() == FormaPagamento.PIX && dto.getValorPix() == null) {
            dto.setValorPix(dto.getValor());
        }

        if (dto.getFormaPagamento() == FormaPagamento.DINHEIRO && dto.getValorDinheiro() == null) {
            dto.setValorDinheiro(dto.getValor());
        }
    }
}
