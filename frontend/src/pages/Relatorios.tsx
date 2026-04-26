import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/api";

type DashboardData = {
  totalEntradas: number;
  totalSaidas: number;
  saldoAtual: number;
  totalUniformeFestividade: number;
  totalUniformePandeiro: number;
};

type MovimentoCaixa = {
  id: number;
  data: string;
  tipo: string;
  descricao: string;
  categoria: string;
  formaPagamento: string;
  valorPix?: number;
  valorDinheiro?: number;
  valor: number;
};

type AbaRelatorio =
  | "geral"
  | "pix"
  | "dinheiro"
  | "saidas"
  | "festividade"
  | "pandeiro"
  | "vendas"
  | "congregacao";

type FormaPagamentoFiltro = "" | "PIX" | "DINHEIRO" | "MISTO";

type LinhaRelatorio = {
  id: string;
  data: string;
  origem: string;
  descricao: string;
  categoria?: string;
  congregacaoId?: number;
  congregacao?: string;
  forma?: string;
  tipo: "ENTRADA" | "SAIDA";
  entrada: number;
  pix: number;
  dinheiro: number;
  saida: number;
  pendente?: number;
  status?: string;
};

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function formatarData(data: string) {
  if (!data) return "-";
  const [ano, mes, dia] = data.split("-");
  return dia && mes && ano ? `${dia}/${mes}/${ano}` : data;
}

function dentroDoPeriodo(data: string, inicio: string, fim: string) {
  if (!data) return true;
  if (inicio && data < inicio) return false;
  if (fim && data > fim) return false;
  return true;
}

function valoresPorForma(forma: string | undefined, total: number, valorPix?: number, valorDinheiro?: number) {
  if (forma === "MISTO") {
    return {
      pix: Number(valorPix || 0),
      dinheiro: Number(valorDinheiro || 0)
    };
  }

  if (forma === "PIX") {
    return { pix: total, dinheiro: 0 };
  }

  if (forma === "DINHEIRO") {
    return { pix: 0, dinheiro: total };
  }

  return { pix: Number(valorPix || 0), dinheiro: Number(valorDinheiro || 0) };
}

function combinaFormaPagamento(
  linha: Pick<LinhaRelatorio, "forma" | "pix" | "dinheiro">,
  formaPagamento: FormaPagamentoFiltro
) {
  if (!formaPagamento) return true;
  if (formaPagamento === "PIX") return linha.pix > 0;
  if (formaPagamento === "DINHEIRO") return linha.dinheiro > 0;
  return linha.forma === "MISTO";
}

function normalizarTexto(valor?: string | number | null) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function origemCaixaPorCategoria(categoria?: string) {
  if (categoria === "venda") return "Vendas";
  if (categoria === "uniforme_festividade") return "Uniforme Festividade";
  if (categoria === "uniforme_pandeiro") return "Uniforme Pandeiro";
  return "Caixa";
}

function modoResumoFinanceiro(aba: AbaRelatorio, formaPagamento: FormaPagamentoFiltro) {
  if (formaPagamento) return formaPagamento;
  if (aba === "pix") return "PIX";
  if (aba === "dinheiro") return "DINHEIRO";
  return "";
}

function valorEntradaPorModo(linha: LinhaRelatorio, modo: FormaPagamentoFiltro) {
  if (!linha.entrada) return 0;
  if (modo === "PIX") return linha.pix;
  if (modo === "DINHEIRO") return linha.dinheiro;
  if (modo === "MISTO") return linha.forma === "MISTO" ? linha.pix + linha.dinheiro : 0;
  return linha.entrada;
}

function valorSaidaPorModo(linha: LinhaRelatorio, modo: FormaPagamentoFiltro) {
  if (!linha.saida) return 0;
  if (modo === "PIX") return linha.pix;
  if (modo === "DINHEIRO") return linha.dinheiro;
  if (modo === "MISTO") return linha.forma === "MISTO" ? linha.pix + linha.dinheiro : 0;
  return linha.saida;
}

function valorPixExibido(linha: LinhaRelatorio, modo: FormaPagamentoFiltro) {
  if (modo === "DINHEIRO") return 0;
  if (modo === "MISTO") return linha.forma === "MISTO" ? linha.pix : 0;
  return linha.pix;
}

function valorDinheiroExibido(linha: LinhaRelatorio, modo: FormaPagamentoFiltro) {
  if (modo === "PIX") return 0;
  if (modo === "MISTO") return linha.forma === "MISTO" ? linha.dinheiro : 0;
  return linha.dinheiro;
}

export default function Relatorios() {
  const [aba, setAba] = useState<AbaRelatorio>("geral");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [tipoMovimento, setTipoMovimento] = useState<"" | "ENTRADA" | "SAIDA">("");
  const [origemFiltro, setOrigemFiltro] = useState("");
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamentoFiltro>("");

  const [dados, setDados] = useState<DashboardData | null>(null);
  const [caixa, setCaixa] = useState<MovimentoCaixa[]>([]);

  useEffect(() => {
    async function carregar() {
      try {
        const [
          dashboardResponse,
          caixaResponse
        ] = await Promise.all([
          api.get("/dashboard"),
          api.get("/caixa")
        ]);

        setDados(dashboardResponse.data);
        setCaixa(caixaResponse.data);
      } catch (error) {
        console.error("Erro ao carregar relatórios", error);
      }
    }

    carregar();
  }, []);

  const linhasBase = useMemo(() => {
    const linhasCaixa: LinhaRelatorio[] = caixa.map((item) => {
      const valor = Number(item.valor || 0);
      const pagamentos = valoresPorForma(item.formaPagamento, valor, item.valorPix, item.valorDinheiro);

      return {
        id: `caixa-${item.id}`,
        data: item.data,
        origem: origemCaixaPorCategoria(item.categoria),
        descricao: item.descricao,
        categoria: item.categoria,
        forma: item.formaPagamento,
        tipo: item.tipo === "SAIDA" ? "SAIDA" : "ENTRADA",
        entrada: item.tipo === "ENTRADA" ? valor : 0,
        pix: pagamentos.pix,
        dinheiro: pagamentos.dinheiro,
        saida: item.tipo === "SAIDA" ? valor : 0,
        status: item.tipo
      };
    });

    let resultado = linhasCaixa;

    if (aba === "pix") {
      resultado = linhasCaixa.filter((linha) => linha.forma === "PIX" || linha.forma === "MISTO");
    }

    if (aba === "dinheiro") {
      resultado = linhasCaixa.filter((linha) => linha.forma === "DINHEIRO" || linha.forma === "MISTO");
    }

    if (aba === "saidas") {
      resultado = linhasCaixa.filter((linha) => linha.saida > 0);
    }

    if (aba === "festividade") {
      resultado = linhasCaixa.filter((linha) => linha.categoria === "uniforme_festividade");
    }

    if (aba === "pandeiro") {
      resultado = linhasCaixa.filter((linha) => linha.categoria === "uniforme_pandeiro");
    }

    if (aba === "vendas") {
      resultado = linhasCaixa.filter((linha) => linha.categoria === "venda");
    }

    if (aba === "congregacao") {
      resultado = linhasCaixa.filter((linha) =>
        linha.categoria === "uniforme_festividade" || linha.categoria === "uniforme_pandeiro"
      );
    }

    return resultado.sort((a, b) => (b.data || "").localeCompare(a.data || ""));
  }, [aba, caixa]);

  const origensDisponiveis = useMemo(() => (
    Array.from(new Set(linhasBase.map((linha) => linha.origem))).sort((a, b) => a.localeCompare(b))
  ), [linhasBase]);

  const categoriasDisponiveis = useMemo(() => (
    Array.from(new Set(caixa.map((item) => item.categoria).filter(Boolean))).sort((a, b) => a.localeCompare(b))
  ), [caixa]);

  const linhas = useMemo(() => {
    const termoBusca = normalizarTexto(busca);

    return linhasBase
      .filter((linha) => dentroDoPeriodo(linha.data, dataInicial, dataFinal))
      .filter((linha) => !categoriaFiltro || linha.categoria === categoriaFiltro)
      .filter((linha) => !tipoMovimento || linha.tipo === tipoMovimento)
      .filter((linha) => !origemFiltro || linha.origem === origemFiltro)
      .filter((linha) => combinaFormaPagamento(linha, formaPagamento))
      .filter((linha) => {
        if (!termoBusca) return true;

        return [
          linha.descricao,
          linha.origem,
          linha.categoria,
          linha.congregacao,
          linha.forma,
          linha.status,
          linha.tipo,
          formatarData(linha.data)
        ].some((campo) => normalizarTexto(campo).includes(termoBusca));
      });
  }, [busca, categoriaFiltro, dataFinal, dataInicial, formaPagamento, linhasBase, origemFiltro, tipoMovimento]);

  const modoResumo = useMemo(() => modoResumoFinanceiro(aba, formaPagamento), [aba, formaPagamento]);

  const resumo = useMemo(() => ({
    entradas: linhas.reduce((total, linha) => total + valorEntradaPorModo(linha, modoResumo), 0),
    pix: linhas.reduce((total, linha) => total + linha.pix, 0),
    dinheiro: linhas.reduce((total, linha) => total + linha.dinheiro, 0),
    filtrado: modoResumo === "PIX"
      ? linhas.reduce((total, linha) => total + linha.pix, 0)
      : modoResumo === "DINHEIRO"
        ? linhas.reduce((total, linha) => total + linha.dinheiro, 0)
        : modoResumo === "MISTO"
          ? linhas.reduce((total, linha) => total + (linha.forma === "MISTO" ? linha.pix + linha.dinheiro : 0), 0)
          : linhas.reduce((total, linha) => total + linha.entrada + linha.saida, 0),
    saidas: linhas.reduce((total, linha) => total + valorSaidaPorModo(linha, modoResumo), 0),
    pendente: linhas.reduce((total, linha) => total + Number(linha.pendente || 0), 0),
    movimentado: linhas.reduce((total, linha) => total + valorEntradaPorModo(linha, modoResumo) + valorSaidaPorModo(linha, modoResumo), 0),
    saldo: linhas.reduce((total, linha) => total + valorEntradaPorModo(linha, modoResumo) - valorSaidaPorModo(linha, modoResumo), 0)
  }), [linhas, modoResumo]);

  const resumoPorCategoria = useMemo(() => {
    const categorias = new Map<string, { entradas: number; saidas: number }>();

    caixa
      .map((item) => {
        const valor = Number(item.valor || 0);
        const pagamentos = valoresPorForma(item.formaPagamento, valor, item.valorPix, item.valorDinheiro);

        return {
          categoria: item.categoria || "Sem categoria",
          data: item.data,
          tipo: item.tipo,
          forma: item.formaPagamento,
          entrada: valor,
          pix: pagamentos.pix,
          dinheiro: pagamentos.dinheiro
        };
      })
      .filter((item) => dentroDoPeriodo(item.data, dataInicial, dataFinal))
      .filter((item) => combinaFormaPagamento(item, formaPagamento))
      .filter((item) => !tipoMovimento || item.tipo === tipoMovimento)
      .forEach((item) => {
        const valor = modoResumo === "PIX"
          ? item.pix
          : modoResumo === "DINHEIRO"
            ? item.dinheiro
            : modoResumo === "MISTO"
              ? item.forma === "MISTO" ? item.pix + item.dinheiro : 0
            : item.entrada;
        const atual = categorias.get(item.categoria) || { entradas: 0, saidas: 0 };

        if (item.tipo === "SAIDA") {
          atual.saidas += valor;
        } else {
          atual.entradas += valor;
        }

        categorias.set(item.categoria, atual);
      });

    return Array.from(categorias.entries())
      .map(([categoria, total]) => ({
        categoria,
        entradas: total.entradas,
        saidas: total.saidas,
        saldo: total.entradas - total.saidas
      }))
      .sort((a, b) => b.saldo - a.saldo);
  }, [caixa, dataFinal, dataInicial, formaPagamento, modoResumo, tipoMovimento]);

  function limparFiltros() {
    setDataInicial("");
    setDataFinal("");
    setBusca("");
    setCategoriaFiltro("");
    setTipoMovimento("");
    setOrigemFiltro("");
    setFormaPagamento("");
  }

  function tituloRelatorio() {
    const titulos: Record<AbaRelatorio, string> = {
      geral: "Relatório Geral do Caixa",
      pix: "Relatório de Recebimentos PIX",
      dinheiro: "Relatório de Recebimentos em Dinheiro",
      saidas: "Relatório de Saídas",
      festividade: "Relatório Uniforme Festividade",
      pandeiro: "Relatório Uniforme Pandeiro",
      vendas: "Relatório de Vendas",
      congregacao: "Relatório de Uniformes"
    };

    return titulos[aba];
  }

  async function baixarRelatorio(tipo: "pdf" | "excel") {
    if (!dataInicial || !dataFinal) {
      alert("Informe data inicial e data final para exportar");
      return;
    }

    const response = await api.get(`/relatorios/financeiro/${tipo}`, {
      params: {
        dataInicial,
        dataFinal
      },
      responseType: "blob"
    });

    const extensao = tipo === "pdf" ? "pdf" : "xls";
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio-financeiro.${extensao}`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <Layout>
      <div className="page-actions" style={{ alignItems: "flex-start", marginBottom: 24 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h2><i className="bi bi-clipboard-data" aria-hidden="true"></i> Relatórios</h2>
          <p>Visualize e imprima relatórios financeiros</p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn btn-outline no-print" type="button" onClick={() => window.print()}>
            <i className="bi bi-printer" aria-hidden="true"></i> Imprimir
          </button>
          <button className="btn btn-outline no-print" type="button" onClick={() => baixarRelatorio("pdf")}>
            <i className="bi bi-file-earmark-pdf" aria-hidden="true"></i> PDF
          </button>
          <button className="btn btn-outline no-print" type="button" onClick={() => baixarRelatorio("excel")}>
            <i className="bi bi-file-earmark-spreadsheet" aria-hidden="true"></i> Excel
          </button>
        </div>
      </div>

      <div className="card no-print" style={{ marginBottom: 30 }}>
        <div className="form-row-3">
          <div className="form-group">
            <label>Busca</label>
            <input className="form-control" type="text" placeholder="Buscar descricao, categoria, origem..." value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Data Inicial</label>
            <input className="form-control" type="date" value={dataInicial} onChange={(e) => setDataInicial(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Data Final</label>
            <input className="form-control" type="date" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Categoria</label>
            <select className="form-control" value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)}>
              <option value="">Todas</option>
              {categoriasDisponiveis.map((categoria) => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row-3">
          <div className="form-group">
            <label>Tipo de Movimento</label>
            <select className="form-control" value={tipoMovimento} onChange={(e) => setTipoMovimento(e.target.value as "" | "ENTRADA" | "SAIDA")}>
              <option value="">Todos</option>
              <option value="ENTRADA">Entradas</option>
              <option value="SAIDA">Saidas</option>
            </select>
          </div>
          <div className="form-group">
            <label>Origem</label>
            <select className="form-control" value={origemFiltro} onChange={(e) => setOrigemFiltro(e.target.value)}>
              <option value="">Todas</option>
              {origensDisponiveis.map((origem) => (
                <option key={origem} value={origem}>{origem}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Forma de Pagamento</label>
            <select className="form-control" value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value as FormaPagamentoFiltro)}>
              <option value="">Todas</option>
              <option value="PIX">PIX</option>
              <option value="DINHEIRO">Dinheiro</option>
              <option value="MISTO">Misto</option>
            </select>
          </div>
        </div>

        <button className="btn btn-outline" type="button" onClick={limparFiltros}>Limpar Filtros</button>
      </div>

      <div className="report-tabs no-print">
        <button className={`tab-btn ${aba === "geral" ? "active" : ""}`} type="button" onClick={() => setAba("geral")}>
          <i className="bi bi-bar-chart" aria-hidden="true"></i> Geral do Caixa
        </button>
        <button className={`tab-btn ${aba === "pix" ? "active" : ""}`} type="button" onClick={() => setAba("pix")}>
          <i className="bi bi-phone" aria-hidden="true"></i> PIX
        </button>
        <button className={`tab-btn ${aba === "dinheiro" ? "active" : ""}`} type="button" onClick={() => setAba("dinheiro")}>
          <i className="bi bi-cash" aria-hidden="true"></i> Dinheiro
        </button>
        <button className={`tab-btn ${aba === "saidas" ? "active" : ""}`} type="button" onClick={() => setAba("saidas")}>
          <i className="bi bi-arrow-down-circle" aria-hidden="true"></i> Saídas
        </button>
        <button className={`tab-btn ${aba === "festividade" ? "active" : ""}`} type="button" onClick={() => setAba("festividade")}>
          <i className="bi bi-bag-heart" aria-hidden="true"></i> Uniforme Festividade
        </button>
        <button className={`tab-btn ${aba === "pandeiro" ? "active" : ""}`} type="button" onClick={() => setAba("pandeiro")}>
          <i className="bi bi-music-note-beamed" aria-hidden="true"></i> Uniforme Pandeiro
        </button>
        <button className={`tab-btn ${aba === "vendas" ? "active" : ""}`} type="button" onClick={() => setAba("vendas")}>
          <i className="bi bi-cart3" aria-hidden="true"></i> Vendas
        </button>
        <button className={`tab-btn ${aba === "congregacao" ? "active" : ""}`} type="button" onClick={() => setAba("congregacao")}>
          <i className="bi bi-bag-check" aria-hidden="true"></i> Uniformes
        </button>
      </div>

      <div className="card">
        <div className="card-title">{tituloRelatorio()}</div>

        {!dados ? (
          <p>Carregando...</p>
        ) : (
          <>
            <div className="report-summary">
              <div className="stat-card green">
                <div className="stat-label">Total Entradas</div>
                <div className="stat-value small">{moeda.format(resumo.entradas)}</div>
              </div>
              <div className="stat-card red">
                <div className="stat-label">Total Saidas</div>
                <div className="stat-value small">{moeda.format(resumo.saidas)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Saldo do Periodo</div>
                <div className="stat-value small">{moeda.format(resumo.saldo)}</div>
              </div>
            </div>

            {aba === "geral" && (
              <div className="card" style={{ marginTop: 20 }}>
                <div className="card-title">Resumo do Caixa por Categoria</div>

                {resumoPorCategoria.length > 0 ? (
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Categoria</th>
                          <th>Entradas</th>
                          <th>Saidas</th>
                          <th>Saldo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resumoPorCategoria.map((item) => (
                          <tr key={item.categoria}>
                            <td>{item.categoria}</td>
                            <td className="money positive">{item.entradas ? moeda.format(item.entradas) : "-"}</td>
                            <td className="money negative">{item.saidas ? moeda.format(item.saidas) : "-"}</td>
                            <td className={`money ${item.saldo >= 0 ? "positive" : "negative"}`}>{moeda.format(item.saldo)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>Nenhum movimento de caixa encontrado para os filtros selecionados.</p>
                  </div>
                )}
              </div>
            )}

            <div className="table-wrapper" style={{ marginTop: 20 }}>
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Origem</th>
                    <th>Descrição</th>
                    <th>Categoria</th>
                    <th>Forma</th>
                    <th>Tipo</th>
                    <th>Entrada</th>
                    <th>PIX</th>
                    <th>Dinheiro</th>
                    <th>Saída</th>
                    <th>Pendente</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {linhas.map((linha) => (
                    <tr key={linha.id}>
                      <td>{formatarData(linha.data)}</td>
                      <td>{linha.origem}</td>
                      <td>{linha.descricao}</td>
                      <td>{linha.categoria || "-"}</td>
                      <td>{linha.forma || "-"}</td>
                      <td>{linha.tipo}</td>
                      <td className="money positive">{valorEntradaPorModo(linha, modoResumo) ? moeda.format(valorEntradaPorModo(linha, modoResumo)) : "-"}</td>
                      <td className="money positive">{valorPixExibido(linha, modoResumo) ? moeda.format(valorPixExibido(linha, modoResumo)) : "-"}</td>
                      <td className="money positive">{valorDinheiroExibido(linha, modoResumo) ? moeda.format(valorDinheiroExibido(linha, modoResumo)) : "-"}</td>
                      <td className="money negative">{valorSaidaPorModo(linha, modoResumo) ? moeda.format(valorSaidaPorModo(linha, modoResumo)) : "-"}</td>
                      <td className="money negative">{linha.pendente ? moeda.format(linha.pendente) : "-"}</td>
                      <td>{linha.status || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {linhas.length === 0 && (
              <div className="empty-state">
                <div className="icon"><i className="bi bi-clipboard-data" aria-hidden="true"></i></div>
                <p>Nenhum registro encontrado para os filtros selecionados.</p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
