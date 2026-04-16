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

type LinhaRelatorio = {
  id: string;
  data: string;
  origem: string;
  descricao: string;
  congregacaoId?: number;
  congregacao?: string;
  forma?: string;
  entrada: number;
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

export default function Relatorios() {
  const [aba, setAba] = useState<AbaRelatorio>("geral");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [congregacaoId, setCongregacaoId] = useState("");

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

  const linhas = useMemo(() => {
    const lotePorId = new Map(lotes.map((lote) => [lote.id, lote]));

    const linhasCaixa: LinhaRelatorio[] = caixa.map((item) => ({
      id: `caixa-${item.id}`,
      data: item.data,
      origem: "Caixa",
      descricao: item.descricao,
      forma: item.formaPagamento,
      entrada: item.tipo === "ENTRADA" ? Number(item.valor) : 0,
      saida: item.tipo === "SAIDA" ? Number(item.valor) : 0,
      status: item.tipo
    }));

    const linhasFestividade: LinhaRelatorio[] = festividade.map((item) => ({
      id: `festividade-${item.id}`,
      data: item.dataPagamento,
      origem: "Uniforme Festividade",
      descricao: `${item.nomeMulher} - ${item.nomeUniforme}`,
      congregacaoId: item.congregacaoId,
      congregacao: item.nomeCongregacao,
      forma: item.valorPix > 0 && item.valorDinheiro > 0 ? "MISTO" : item.valorPix > 0 ? "PIX" : "DINHEIRO",
      entrada: Number(item.totalPago),
      saida: 0,
      pendente: Number(item.saldoPendente),
      status: item.statusPagamento
    }));

    const linhasPandeiro: LinhaRelatorio[] = pandeiro.map((item) => ({
      id: `pandeiro-${item.id}`,
      data: item.dataPagamento,
      origem: "Uniforme Pandeiro",
      descricao: `${item.nomeMulher} - ${item.nomeUniforme}`,
      congregacaoId: item.congregacaoId,
      congregacao: item.nomeCongregacao,
      forma: item.valorPix > 0 && item.valorDinheiro > 0 ? "MISTO" : item.valorPix > 0 ? "PIX" : "DINHEIRO",
      entrada: Number(item.totalPago),
      saida: 0,
      pendente: Number(item.saldoPendente),
      status: item.statusPagamento
    }));

    const linhasVendas: LinhaRelatorio[] = vendas.map((item) => {
      const lote = lotePorId.get(item.loteVendaId);

      return {
        id: `venda-${item.id}`,
        data: lote?.dataVenda || "",
        origem: "Vendas",
        descricao: `${item.comprador} - ${item.produto} (${item.quantidade})`,
        forma: item.formaPagamento,
        entrada: Number(item.valorPago),
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

    return resultado
      .filter((linha) => dentroDoPeriodo(linha.data, dataInicial, dataFinal))
      .filter((linha) => !congregacaoId || String(linha.congregacaoId) === congregacaoId);
  }, [aba, caixa, congregacaoId, dataFinal, dataInicial, festividade, lotes, pandeiro, vendas]);

  const resumo = useMemo(() => ({
    entradas: linhas.reduce((total, linha) => total + linha.entrada, 0),
    saidas: linhas.reduce((total, linha) => total + linha.saida, 0),
    pendente: linhas.reduce((total, linha) => total + Number(linha.pendente || 0), 0)
  }), [linhas]);

  function limparFiltros() {
    setDataInicial("");
    setDataFinal("");
    setCongregacaoId("");
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

  return (
    <Layout>
      <div className="page-actions" style={{ alignItems: "flex-start", marginBottom: 24 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h2><i className="bi bi-clipboard-data" aria-hidden="true"></i> Relatórios</h2>
          <p>Visualize e imprima relatórios financeiros</p>
        </div>

        <button className="btn btn-outline no-print" type="button" onClick={() => window.print()}>
          <i className="bi bi-printer" aria-hidden="true"></i> Imprimir
        </button>
      </div>

      <div className="card no-print" style={{ marginBottom: 30 }}>
        <div className="form-row-3">
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
                <div className="stat-label">Total Saídas</div>
                <div className="stat-value small">{moeda.format(resumo.saidas)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Saldo Final</div>
                <div className="stat-value small">{moeda.format(resumo.entradas - resumo.saidas)}</div>
              </div>
              <div className="stat-card orange">
                <div className="stat-label">Pendente</div>
                <div className="stat-value small">{moeda.format(resumo.pendente)}</div>
              </div>
            </div>

            <div className="table-wrapper" style={{ marginTop: 20 }}>
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Origem</th>
                    <th>Descrição</th>
                    <th>Congregação</th>
                    <th>Forma</th>
                    <th>Entrada</th>
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
                      <td className="money positive">{linha.entrada ? moeda.format(linha.entrada) : "-"}</td>
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
