package com.ufads.tesouraria.service;

import com.ufads.tesouraria.dto.RelatorioFinanceiroDTO;
import com.ufads.tesouraria.entity.Congregacao;
import com.ufads.tesouraria.entity.MovimentoCaixa;
import com.ufads.tesouraria.entity.UniformeFestividade;
import com.ufads.tesouraria.entity.UniformePandeiro;
import com.ufads.tesouraria.enums.TipoMovimento;
import com.ufads.tesouraria.exception.ResourceNotFoundException;
import com.ufads.tesouraria.mapper.MovimentoCaixaMapper;
import com.ufads.tesouraria.mapper.UniformeFestividadeMapper;
import com.ufads.tesouraria.mapper.UniformePandeiroMapper;
import com.ufads.tesouraria.repository.CongregacaoRepository;
import com.ufads.tesouraria.repository.MovimentoCaixaRepository;
import com.ufads.tesouraria.repository.UniformeFestividadeRepository;
import com.ufads.tesouraria.repository.UniformePandeiroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class RelatorioService {

    private final MovimentoCaixaRepository movimentoCaixaRepository;
    private final UniformeFestividadeRepository uniformeFestividadeRepository;
    private final UniformePandeiroRepository uniformePandeiroRepository;
    private final CongregacaoRepository congregacaoRepository;

    public RelatorioFinanceiroDTO gerarFinanceiro(
            LocalDate dataInicial,
            LocalDate dataFinal,
            Long congregacaoId
    ) {
        validarPeriodo(dataInicial, dataFinal);

        Congregacao congregacao = null;
        if (congregacaoId != null) {
            congregacao = congregacaoRepository.findById(congregacaoId)
                    .orElseThrow(() -> new ResourceNotFoundException("Congregacao nao encontrada"));
        }

        List<MovimentoCaixa> movimentos = movimentoCaixaRepository.findByAtivoTrue()
                .stream()
                .filter(m -> estaNoPeriodo(m.getData(), dataInicial, dataFinal))
                .toList();

        List<UniformeFestividade> uniformesFestividade = uniformeFestividadeRepository.findByAtivoTrue()
                .stream()
                .filter(u -> estaNoPeriodo(u.getDataPagamento(), dataInicial, dataFinal))
                .filter(u -> congregacaoId == null || Objects.equals(u.getCongregacao().getId(), congregacaoId))
                .toList();

        List<UniformePandeiro> uniformesPandeiro = uniformePandeiroRepository.findByAtivoTrue()
                .stream()
                .filter(u -> estaNoPeriodo(u.getDataPagamento(), dataInicial, dataFinal))
                .filter(u -> congregacaoId == null || Objects.equals(u.getCongregacao().getId(), congregacaoId))
                .toList();

        BigDecimal totalEntradas = somarMovimentos(movimentos, TipoMovimento.ENTRADA);
        BigDecimal totalSaidas = somarMovimentos(movimentos, TipoMovimento.SAIDA);
        BigDecimal totalFestividade = somarFestividade(uniformesFestividade, false);
        BigDecimal pendenteFestividade = somarFestividade(uniformesFestividade, true);
        BigDecimal totalPandeiro = somarPandeiro(uniformesPandeiro, false);
        BigDecimal pendentePandeiro = somarPandeiro(uniformesPandeiro, true);

        return RelatorioFinanceiroDTO.builder()
                .dataInicial(dataInicial)
                .dataFinal(dataFinal)
                .congregacaoId(congregacaoId)
                .nomeCongregacao(congregacao == null ? null : congregacao.getNome())
                .totalEntradas(totalEntradas)
                .totalSaidas(totalSaidas)
                .saldoCaixa(totalEntradas.subtract(totalSaidas))
                .totalUniformeFestividade(totalFestividade)
                .totalUniformePandeiro(totalPandeiro)
                .totalArrecadadoUniformes(totalFestividade.add(totalPandeiro))
                .totalPendenteUniformes(pendenteFestividade.add(pendentePandeiro))
                .totalMovimentos((long) movimentos.size())
                .totalUniformesFestividade((long) uniformesFestividade.size())
                .totalUniformesPandeiro((long) uniformesPandeiro.size())
                .movimentos(movimentos.stream().map(MovimentoCaixaMapper::toResponseDTO).toList())
                .uniformesFestividade(uniformesFestividade.stream().map(UniformeFestividadeMapper::toResponseDTO).toList())
                .uniformesPandeiro(uniformesPandeiro.stream().map(UniformePandeiroMapper::toResponseDTO).toList())
                .build();
    }

    public String gerarCsv(LocalDate dataInicial, LocalDate dataFinal, Long congregacaoId) {
        RelatorioFinanceiroDTO relatorio = gerarFinanceiro(dataInicial, dataFinal, congregacaoId);

        StringBuilder csv = new StringBuilder();
        csv.append("campo;valor\n");
        csv.append("dataInicial;").append(valor(relatorio.getDataInicial())).append("\n");
        csv.append("dataFinal;").append(valor(relatorio.getDataFinal())).append("\n");
        csv.append("congregacao;").append(valor(relatorio.getNomeCongregacao())).append("\n");
        csv.append("totalEntradas;").append(relatorio.getTotalEntradas()).append("\n");
        csv.append("totalSaidas;").append(relatorio.getTotalSaidas()).append("\n");
        csv.append("saldoCaixa;").append(relatorio.getSaldoCaixa()).append("\n");
        csv.append("totalUniformeFestividade;").append(relatorio.getTotalUniformeFestividade()).append("\n");
        csv.append("totalUniformePandeiro;").append(relatorio.getTotalUniformePandeiro()).append("\n");
        csv.append("totalArrecadadoUniformes;").append(relatorio.getTotalArrecadadoUniformes()).append("\n");
        csv.append("totalPendenteUniformes;").append(relatorio.getTotalPendenteUniformes()).append("\n");
        csv.append("totalMovimentos;").append(relatorio.getTotalMovimentos()).append("\n");
        csv.append("totalUniformesFestividade;").append(relatorio.getTotalUniformesFestividade()).append("\n");
        csv.append("totalUniformesPandeiro;").append(relatorio.getTotalUniformesPandeiro()).append("\n");

        return csv.toString();
    }

    public byte[] gerarExcel(LocalDate dataInicial, LocalDate dataFinal, Long congregacaoId) {
        RelatorioFinanceiroDTO relatorio = gerarFinanceiro(dataInicial, dataFinal, congregacaoId);

        StringBuilder html = new StringBuilder();
        html.append("<html><head><meta charset=\"UTF-8\"></head><body>");
        html.append("<h1>Relatorio Financeiro</h1>");
        html.append("<table border=\"1\">");
        html.append("<tr><th>Campo</th><th>Valor</th></tr>");
        adicionarLinhaHtml(html, "Data inicial", relatorio.getDataInicial());
        adicionarLinhaHtml(html, "Data final", relatorio.getDataFinal());
        adicionarLinhaHtml(html, "Congregacao", relatorio.getNomeCongregacao());
        adicionarLinhaHtml(html, "Total entradas", relatorio.getTotalEntradas());
        adicionarLinhaHtml(html, "Total saidas", relatorio.getTotalSaidas());
        adicionarLinhaHtml(html, "Saldo caixa", relatorio.getSaldoCaixa());
        adicionarLinhaHtml(html, "Uniforme festividade", relatorio.getTotalUniformeFestividade());
        adicionarLinhaHtml(html, "Uniforme pandeiro", relatorio.getTotalUniformePandeiro());
        adicionarLinhaHtml(html, "Arrecadado uniformes", relatorio.getTotalArrecadadoUniformes());
        adicionarLinhaHtml(html, "Pendente uniformes", relatorio.getTotalPendenteUniformes());
        adicionarLinhaHtml(html, "Total movimentos", relatorio.getTotalMovimentos());
        html.append("</table></body></html>");

        return html.toString().getBytes(StandardCharsets.UTF_8);
    }

    public byte[] gerarPdf(LocalDate dataInicial, LocalDate dataFinal, Long congregacaoId) {
        RelatorioFinanceiroDTO relatorio = gerarFinanceiro(dataInicial, dataFinal, congregacaoId);

        StringBuilder texto = new StringBuilder();
        texto.append("Relatorio Financeiro\\n");
        texto.append("Periodo: ").append(valor(relatorio.getDataInicial())).append(" a ").append(valor(relatorio.getDataFinal())).append("\\n");
        texto.append("Congregacao: ").append(valor(relatorio.getNomeCongregacao())).append("\\n\\n");
        texto.append("Total entradas: ").append(relatorio.getTotalEntradas()).append("\\n");
        texto.append("Total saidas: ").append(relatorio.getTotalSaidas()).append("\\n");
        texto.append("Saldo caixa: ").append(relatorio.getSaldoCaixa()).append("\\n");
        texto.append("Uniforme festividade: ").append(relatorio.getTotalUniformeFestividade()).append("\\n");
        texto.append("Uniforme pandeiro: ").append(relatorio.getTotalUniformePandeiro()).append("\\n");
        texto.append("Arrecadado uniformes: ").append(relatorio.getTotalArrecadadoUniformes()).append("\\n");
        texto.append("Pendente uniformes: ").append(relatorio.getTotalPendenteUniformes()).append("\\n");

        return criarPdfSimples(texto.toString());
    }

    private void validarPeriodo(LocalDate dataInicial, LocalDate dataFinal) {
        if (dataInicial == null || dataFinal == null) {
            throw new RuntimeException("dataInicial e dataFinal sao obrigatorias");
        }

        if (dataFinal.isBefore(dataInicial)) {
            throw new RuntimeException("dataFinal nao pode ser anterior a dataInicial");
        }
    }

    private boolean estaNoPeriodo(LocalDate data, LocalDate dataInicial, LocalDate dataFinal) {
        return data != null && !data.isBefore(dataInicial) && !data.isAfter(dataFinal);
    }

    private BigDecimal somarMovimentos(List<MovimentoCaixa> movimentos, TipoMovimento tipo) {
        return movimentos.stream()
                .filter(m -> m.getTipo() == tipo)
                .map(MovimentoCaixa::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal somarFestividade(List<UniformeFestividade> uniformes, boolean pendente) {
        return uniformes.stream()
                .map(uniforme -> pendente ? uniforme.getSaldoPendente() : uniforme.getTotalPago())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal somarPandeiro(List<UniformePandeiro> uniformes, boolean pendente) {
        return uniformes.stream()
                .map(uniforme -> pendente ? uniforme.getSaldoPendente() : uniforme.getTotalPago())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String valor(Object valor) {
        return valor == null ? "" : valor.toString();
    }

    private void adicionarLinhaHtml(StringBuilder html, String campo, Object valor) {
        html.append("<tr><td>")
                .append(escaparHtml(campo))
                .append("</td><td>")
                .append(escaparHtml(valor(valor)))
                .append("</td></tr>");
    }

    private String escaparHtml(String texto) {
        return texto == null ? "" : texto
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");
    }

    private byte[] criarPdfSimples(String texto) {
        String[] linhas = texto.split("\\\\n");
        StringBuilder stream = new StringBuilder();
        stream.append("BT\n/F1 12 Tf\n50 790 Td\n14 TL\n");
        for (String linha : linhas) {
            stream.append("(").append(escaparPdf(linha)).append(") Tj\nT*\n");
        }
        stream.append("ET");

        List<String> objetos = new ArrayList<>();
        objetos.add("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
        objetos.add("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
        objetos.add("3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n");
        objetos.add("4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n");
        objetos.add("5 0 obj\n<< /Length " + stream.length() + " >>\nstream\n" + stream + "\nendstream\nendobj\n");

        StringBuilder pdf = new StringBuilder("%PDF-1.4\n");
        List<Integer> offsets = new ArrayList<>();
        for (String objeto : objetos) {
            offsets.add(pdf.length());
            pdf.append(objeto);
        }

        int xref = pdf.length();
        pdf.append("xref\n0 ").append(objetos.size() + 1).append("\n");
        pdf.append("0000000000 65535 f \n");
        for (Integer offset : offsets) {
            pdf.append(String.format("%010d 00000 n \n", offset));
        }
        pdf.append("trailer\n<< /Size ").append(objetos.size() + 1).append(" /Root 1 0 R >>\n");
        pdf.append("startxref\n").append(xref).append("\n%%EOF");

        return pdf.toString().getBytes(StandardCharsets.ISO_8859_1);
    }

    private String escaparPdf(String texto) {
        return texto.replace("\\", "\\\\")
                .replace("(", "\\(")
                .replace(")", "\\)");
    }
}
