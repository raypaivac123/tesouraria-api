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

type Congregacao = {
  id: number;
  nome: string;
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

type Venda = {
  id: number;
  comprador: string;
  loteVendaId: number;
  produto: string;
  quantidade: number;
  total: number;
  valorPago: number;
  valorPix?: number;
  valorDinheiro?: number;
  pendente: number;
  formaPagamento: string;
  statusPagamento: string;
};

type LoteVenda = {
  id: number;
  dataVenda: string;
};

type Uniforme = {
  id: number;
  nomeMulher: string;
  congregacaoId: number;
  nomeCongregacao: string;
  nomeUniforme: string;
  valorUniforme: number;
  valorPix: number;
  valorDinheiro: number;
  totalPago: number;
  saldoPendente: number;
  statusPagamento: string;
  dataPagamento: string;
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

function formaUniforme(valorPix: number, valorDinheiro: number) {
  if (valorPix > 0 && valorDinheiro > 0) return "MISTO";
  if (valorPix > 0) return "PIX";
  if (valorDinheiro > 0) return "DINHEIRO";
  return "";
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

export default function Relatorios() {
  const [aba, setAba] = useState<AbaRelatorio>("geral");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [busca, setBusca] = useState("");
  const [congregacaoId, setCongregacaoId] = useState("");
  const [tipoMovimento, setTipoMovimento] = useState<"" | "ENTRADA" | "SAIDA">("");
  const [origemFiltro, setOrigemFiltro] = useState("");
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamentoFiltro>("");

  const [dados, setDados] = useState<DashboardData | null>(null);
  const [congregacoes, setCongregacoes] = useState<Congregacao[]>([]);
  const [caixa, setCaixa] = useState<MovimentoCaixa[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [lotes, setLotes] = useState<LoteVenda[]>([]);
  const [festividade, setFestividade] = useState<Uniforme[]>([]);
  const [pandeiro, setPandeiro] = useState<Uniforme[]>([]);

  useEffect(() => {
    async function carregar() {
      try {
        const [
          dashboardResponse,
          congregacoesResponse,
          caixaResponse,
          vendasResponse,
          lotesResponse,
          festividadeResponse,
          pandeiroResponse
        ] = await Promise.all([
          api.get("/dashboard"),
          api.get("/congregacoes"),
          api.get("/caixa"),
          api.get("/vendas"),
          api.get("/lotes-venda"),
          api.get("/uniforme-festividade"),
          api.get("/uniforme-pandeiro")
        ]);

        setDados(dashboardResponse.data);
        setCongregacoes(congregacoesResponse.data);
        setCaixa(caixaResponse.data);
        setVendas(vendasResponse.data);
        setLotes(lotesResponse.data);
        setFestividade(festividadeResponse.data);
        setPandeiro(pandeiroResponse.data);
      } catch (error) {
        console.error("Erro ao carregar relatórios", error);
      }
    }

    carregar();
  }, []);

  const linhasBase = useMemo(() => {
    const lotePorId = new Map(lotes.map((lote) => [lote.id, lote]));

    const linhasCaixa: LinhaRelatorio[] = caixa.map((item) => {
      const valor = Number(item.valor || 0);
      const pagamentos = valoresPorForma(item.formaPagamento, valor, item.valorPix, item.valorDinheiro);

      return {
        id: `caixa-${item.id}`,
        data: item.data,
        origem: "Caixa",
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

    const linhasFestividade: LinhaRelatorio[] = festividade.map((item) => {
      const valorPix = Number(item.valorPix || 0);
      const valorDinheiro = Number(item.valorDinheiro || 0);

      return {
        id: `festividade-${item.id}`,
        data: item.dataPagamento,
        origem: "Uniforme Festividade",
        descricao: `${item.nomeMulher} - ${item.nomeUniforme}`,
        congregacaoId: item.congregacaoId,
        congregacao: item.nomeCongregacao,
        forma: formaUniforme(valorPix, valorDinheiro),
        tipo: "ENTRADA",
        entrada: Number(item.totalPago),
        pix: valorPix,
        dinheiro: valorDinheiro,
        saida: 0,
        pendente: Number(item.saldoPendente),
        status: item.statusPagamento
      };
    });

    const linhasPandeiro: LinhaRelatorio[] = pandeiro.map((item) => {
      const valorPix = Number(item.valorPix || 0);
      const valorDinheiro = Number(item.valorDinheiro || 0);

      return {
        id: `pandeiro-${item.id}`,
        data: item.dataPagamento,
        origem: "Uniforme Pandeiro",
        descricao: `${item.nomeMulher} - ${item.nomeUniforme}`,
        congregacaoId: item.congregacaoId,
        congregacao: item.nomeCongregacao,
        forma: formaUniforme(valorPix, valorDinheiro),
        tipo: "ENTRADA",
        entrada: Number(item.totalPago),
        pix: valorPix,
        dinheiro: valorDinheiro,
        saida: 0,
        pendente: Number(item.saldoPendente),
        status: item.statusPagamento
      };
    });

    const linhasVendas: LinhaRelatorio[] = vendas.map((item) => {
      const lote = lotePorId.get(item.loteVendaId);
      const valorPago = Number(item.valorPago || 0);
      const pagamentos = valoresPorForma(item.formaPagamento, valorPago, item.valorPix, item.valorDinheiro);

      return {
        id: `venda-${item.id}`,
        data: lote?.dataVenda || "",
        origem: "Vendas",
        descricao: `${item.comprador} - ${item.produto} (${item.quantidade})`,
        forma: item.formaPagamento,
        tipo: "ENTRADA",
        entrada: valorPago,
        pix: pagamentos.pix,
        dinheiro: pagamentos.dinheiro,
        saida: 0,
        pendente: Number(item.pendente),
        status: item.statusPagamento
      };
    });

    let resultado = [...linhasCaixa, ...linhasFestividade, ...linhasPandeiro, ...linhasVendas];

    if (aba === "pix") {
      resultado = resultado.filter((linha) => linha.forma === "PIX" || linha.forma === "MISTO");
    }

    if (aba === "dinheiro") {
      resultado = resultado.filter((linha) => linha.forma === "DINHEIRO" || linha.forma === "MISTO");
    }

    if (aba === "saidas") {
      resultado = linhasCaixa.filter((linha) => linha.saida > 0);
    }

    if (aba === "festividade") {
      resultado = linhasFestividade;
    }

    if (aba === "pandeiro") {
      resultado = linhasPandeiro;
    }

    if (aba === "vendas") {
      resultado = linhasVendas;
    }

    if (aba === "congregacao") {
      resultado = [...linhasFestividade, ...linhasPandeiro];
    }

    return resultado.sort((a, b) => (b.data || "").localeCompare(a.data || ""));
  }, [aba, caixa, festividade, lotes, pandeiro, vendas]);

  const origensDisponiveis = useMemo(() => (
    Array.from(new Set(linhasBase.map((linha) => linha.origem))).sort((a, b) => a.localeCompare(b))
  ), [linhasBase]);

  const linhas = useMemo(() => {
    const termoBusca = normalizarTexto(busca);

    return linhasBase
      .filter((linha) => dentroDoPeriodo(linha.data, dataInicial, dataFinal))
      .filter((linha) => !congregacaoId || String(linha.congregacaoId) === congregacaoId)
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
  }, [busca, congregacaoId, dataFinal, dataInicial, formaPagamento, linhasBase, origemFiltro, tipoMovimento]);

  const resumo = useMemo(() => ({
    entradas: linhas.reduce((total, linha) => total + linha.entrada, 0),
    pix: linhas.reduce((total, linha) => total + linha.pix, 0),
    dinheiro: linhas.reduce((total, linha) => total + linha.dinheiro, 0),
    filtrado: formaPagamento === "PIX"
      ? linhas.reduce((total, linha) => total + linha.pix, 0)
      : formaPagamento === "DINHEIRO"
        ? linhas.reduce((total, linha) => total + linha.dinheiro, 0)
        : linhas.reduce((total, linha) => total + linha.pix + linha.dinheiro, 0),
    saidas: linhas.reduce((total, linha) => total + linha.saida, 0),
    pendente: linhas.reduce((total, linha) => total + Number(linha.pendente || 0), 0),
    movimentado: linhas.reduce((total, linha) => total + linha.entrada + linha.saida, 0),
    saldo: linhas.reduce((total, linha) => total + linha.entrada - linha.saida, 0)
  }), [formaPagamento, linhas]);

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
        const valor = formaPagamento === "PIX"
          ? item.pix
          : formaPagamento === "DINHEIRO"
            ? item.dinheiro
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
  }, [caixa, dataFinal, dataInicial, formaPagamento, tipoMovimento]);

  function limparFiltros() {
    setDataInicial("");
    setDataFinal("");
    setBusca("");
    setCongregacaoId("");
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
      congregacao: "Relatório por Congregação"
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
        dataFinal,
        congregacaoId: congregacaoId || undefined
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
            <label>Congregação</label>
            <select className="form-control" value={congregacaoId} onChange={(e) => setCongregacaoId(e.target.value)}>
              <option value="">Todas</option>
              {congregacoes.map((item) => (
                <option key={item.id} value={item.id}>{item.nome}</option>
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
          <i className="bi bi-building" aria-hidden="true"></i> Por Congregação
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
              <div className="stat-card">
                <div className="stat-label">Movimentado em PIX</div>
                <div className="stat-value small">{moeda.format(resumo.pix)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Movimentado em Dinheiro</div>
                <div className="stat-value small">{moeda.format(resumo.dinheiro)}</div>
              </div>
              {formaPagamento && (
                <div className="stat-card green">
                  <div className="stat-label">Total do Filtro</div>
                  <div className="stat-value small">{moeda.format(resumo.filtrado)}</div>
                </div>
              )}
              <div className="stat-card">
                <div className="stat-label">Total Movimentado</div>
                <div className="stat-value small">{moeda.format(resumo.movimentado)}</div>
              </div>
              <div className="stat-card orange">
                <div className="stat-label">Pendente</div>
                <div className="stat-value small">{moeda.format(resumo.pendente)}</div>
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
                    <th>Congregação</th>
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
                      <td>{linha.congregacao || "-"}</td>
                      <td>{linha.forma || "-"}</td>
                      <td>{linha.tipo}</td>
                      <td className="money positive">{linha.entrada ? moeda.format(linha.entrada) : "-"}</td>
                      <td className="money positive">{linha.pix ? moeda.format(linha.pix) : "-"}</td>
                      <td className="money positive">{linha.dinheiro ? moeda.format(linha.dinheiro) : "-"}</td>
                      <td className="money negative">{linha.saida ? moeda.format(linha.saida) : "-"}</td>
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
