import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import api from "../api/api";

type MovimentoCaixa = {
  id: number;
  data: string;
  tipo: string;
  descricao: string;
  categoria: string;
  formaPagamento: string;
  valor: number;
  valorPix?: number;
  valorDinheiro?: number;
  observacao?: string;
  justificativa?: string;
};

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function formatarData(data: string) {
  if (!data) return "-";
  const [ano, mes, dia] = data.split("-");
  return dia && mes && ano ? `${dia}/${mes}/${ano}` : data;
}

function normalizarTexto(valor?: string | number | null) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function mensagemErroApi(error: unknown, acao: string) {
  if (!axios.isAxiosError(error)) {
    return `Erro ao ${acao}`;
  }

  const status = error.response?.status;
  const erro = error.response?.data?.erro || error.response?.data?.message;

  if (erro) {
    return `Erro ao ${acao}: ${erro}`;
  }

  return `Erro ao ${acao}${status ? ` (${status})` : ""}`;
}

export default function Caixa() {
  const [movimentos, setMovimentos] = useState<MovimentoCaixa[]>([]);
  const [busca, setBusca] = useState("");
  const [dataInicialFiltro, setDataInicialFiltro] = useState("");
  const [dataFinalFiltro, setDataFinalFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [formaPagamentoFiltro, setFormaPagamentoFiltro] = useState("");
  const [editando, setEditando] = useState<MovimentoCaixa | null>(null);
  const [form, setForm] = useState({
    data: "",
    tipo: "ENTRADA",
    descricao: "",
    categoria: "",
    formaPagamento: "PIX",
    valor: "",
    valorPix: "",
    valorDinheiro: "",
    observacao: "",
    justificativa: ""
  });

  async function carregarCaixa() {
    try {
      const response = await api.get("/caixa");
      setMovimentos(response.data);
    } catch (error) {
      console.error("Erro ao carregar caixa", error);
    }
  }

  useEffect(() => {
    carregarCaixa();
  }, []);

  function abrirEdicao(item: MovimentoCaixa) {
    setEditando(item);
    setForm({
      data: item.data || "",
      tipo: item.tipo || "ENTRADA",
      descricao: item.descricao || "",
      categoria: item.categoria || "",
      formaPagamento: item.formaPagamento || "PIX",
      valor: String(item.valor || ""),
      valorPix: String(item.valorPix || ""),
      valorDinheiro: String(item.valorDinheiro || ""),
      observacao: item.observacao || "",
      justificativa: item.justificativa || ""
    });
  }

  function cancelarEdicao() {
    setEditando(null);
    setForm({
      data: "",
      tipo: "ENTRADA",
      descricao: "",
      categoria: "",
      formaPagamento: "PIX",
      valor: "",
      valorPix: "",
      valorDinheiro: "",
      observacao: "",
      justificativa: ""
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function salvarEdicao(e: React.FormEvent) {
    e.preventDefault();

    if (!editando) {
      return;
    }

    try {
      await api.put(`/caixa/${editando.id}`, {
        ...form,
        valor: Number(form.valor),
        valorPix: form.formaPagamento === "MISTO" ? Number(form.valorPix || 0) : undefined,
        valorDinheiro: form.formaPagamento === "MISTO" ? Number(form.valorDinheiro || 0) : undefined,
        justificativa: form.tipo === "SAIDA" ? form.justificativa : form.justificativa || undefined
      });

      cancelarEdicao();
      await carregarCaixa();
      alert("Movimento atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar movimento", error);
      alert(mensagemErroApi(error, "atualizar movimento"));
    }
  }

  async function excluirMovimento(item: MovimentoCaixa) {
    if (!window.confirm(`Deseja excluir "${item.descricao}"?`)) {
      return;
    }

    try {
      await api.delete(`/caixa/${item.id}`);
      await carregarCaixa();
      alert("Movimento excluido com sucesso");
    } catch (error) {
      console.error("Erro ao excluir movimento", error);
      alert(mensagemErroApi(error, "excluir movimento"));
    }
  }

  const movimentosFiltrados = useMemo(() => {
    const termoBusca = normalizarTexto(busca);

    return movimentos
      .filter((item) => {
        const camposBusca = [
          item.descricao,
          item.categoria,
          item.formaPagamento,
          item.observacao,
          item.justificativa,
          item.tipo === "ENTRADA" ? "entrada" : "saida",
          formatarData(item.data),
          moeda.format(item.valor)
        ];
        const combinaBusca = !termoBusca || camposBusca.some((campo) => normalizarTexto(campo).includes(termoBusca));
        const combinaDataInicial = !dataInicialFiltro || (item.data || "") >= dataInicialFiltro;
        const combinaDataFinal = !dataFinalFiltro || (item.data || "") <= dataFinalFiltro;
        const combinaTipo = !tipoFiltro || item.tipo === tipoFiltro;
        const combinaFormaPagamento = !formaPagamentoFiltro || item.formaPagamento === formaPagamentoFiltro;

        return combinaBusca && combinaDataInicial && combinaDataFinal && combinaTipo && combinaFormaPagamento;
      })
      .sort((a, b) => (b.data || "").localeCompare(a.data || ""));
  }, [busca, dataFinalFiltro, dataInicialFiltro, formaPagamentoFiltro, movimentos, tipoFiltro]);

  const resumo = useMemo(() => {
    const entradas = movimentosFiltrados
      .filter((item) => item.tipo === "ENTRADA")
      .reduce((total, item) => total + Number(item.valor), 0);
    const saidas = movimentosFiltrados
      .filter((item) => item.tipo === "SAIDA")
      .reduce((total, item) => total + Number(item.valor), 0);

    return { entradas, saidas, saldo: entradas - saidas };
  }, [movimentosFiltrados]);

  return (
    <Layout>
      <div className="caixa-page">
        <div className="page-header">
          <h2>Controle de Caixa</h2>
          <p>Registre entradas e saidas financeiras</p>
        </div>

        <div className="grid-3" style={{ marginBottom: 24 }}>
          <div className="stat-card green">
            <div className="stat-label">Saldo Atual</div>
            <div className="stat-value">{moeda.format(resumo.saldo)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Entradas</div>
            <div className="stat-value small">{moeda.format(resumo.entradas)}</div>
          </div>
          <div className="stat-card red">
            <div className="stat-label">Total Saidas</div>
            <div className="stat-value small">{moeda.format(resumo.saidas)}</div>
          </div>
        </div>

        <div className="page-actions">
          <div className="filters-bar caixa-filters">
            <input
              className="form-control search-control"
              type="text"
              placeholder="Buscar por descricao, categoria, forma ou valor..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <input className="form-control filter-control" type="date" value={dataInicialFiltro} onChange={(e) => setDataInicialFiltro(e.target.value)} />
            <input className="form-control filter-control" type="date" value={dataFinalFiltro} onChange={(e) => setDataFinalFiltro(e.target.value)} />
            <select className="form-control filter-control" value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}>
              <option value="">Todos os tipos</option>
              <option value="ENTRADA">Entradas</option>
              <option value="SAIDA">Saidas</option>
            </select>
            <select className="form-control filter-control" value={formaPagamentoFiltro} onChange={(e) => setFormaPagamentoFiltro(e.target.value)}>
              <option value="">Todas as formas</option>
              <option value="PIX">PIX</option>
              <option value="DINHEIRO">Dinheiro</option>
              <option value="MISTO">Misto</option>
            </select>
          </div>
          <Link className="btn btn-primary" to="/novo-movimento">
            <i className="bi bi-plus-lg" aria-hidden="true"></i> Nova Movimentacao
          </Link>
        </div>

        {editando && (
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-title">Editar Movimento</div>
            <form onSubmit={salvarEdicao}>
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo *</label>
                  <select className="form-control" name="tipo" value={form.tipo} onChange={handleChange}>
                    <option value="ENTRADA">Entrada</option>
                    <option value="SAIDA">Saida</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Data *</label>
                  <input className="form-control" name="data" type="date" value={form.data} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Descricao *</label>
                  <input className="form-control" name="descricao" value={form.descricao} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Categoria *</label>
                  <input className="form-control" name="categoria" value={form.categoria} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Forma *</label>
                  <select className="form-control" name="formaPagamento" value={form.formaPagamento} onChange={handleChange}>
                    <option value="PIX">PIX</option>
                    <option value="DINHEIRO">Dinheiro</option>
                    <option value="MISTO">Misto</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Valor *</label>
                  <input className="form-control" name="valor" type="number" min="0" step="0.01" value={form.valor} onChange={handleChange} />
                </div>
              </div>

              {form.formaPagamento === "MISTO" && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Valor em PIX *</label>
                    <input className="form-control" name="valorPix" type="number" min="0" step="0.01" value={form.valorPix} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Valor em Dinheiro *</label>
                    <input className="form-control" name="valorDinheiro" type="number" min="0" step="0.01" value={form.valorDinheiro} onChange={handleChange} />
                  </div>
                </div>
              )}

              {form.tipo === "SAIDA" && (
                <div className="form-group">
                  <label>Justificativa da Saida *</label>
                  <input className="form-control" name="justificativa" value={form.justificativa} onChange={handleChange} />
                </div>
              )}

              <div className="form-group">
                <label>Observacao</label>
                <input className="form-control" name="observacao" value={form.observacao} onChange={handleChange} />
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button className="btn btn-outline" type="button" onClick={cancelarEdicao}>Cancelar</button>
                <button className="btn btn-primary" type="submit">Salvar Alteracoes</button>
              </div>
            </form>
          </div>
        )}

        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Descricao</th>
                  <th>Categoria</th>
                  <th>Forma</th>
                  <th>Valor</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {movimentosFiltrados.map((item) => (
                  <tr key={item.id}>
                    <td>{formatarData(item.data)}</td>
                    <td>
                      <span className={`badge ${item.tipo === "ENTRADA" ? "badge-entrada" : "badge-saida"}`}>
                        {item.tipo === "ENTRADA" ? "Entrada" : "Saida"}
                      </span>
                    </td>
                    <td>{item.descricao}</td>
                    <td>{item.categoria}</td>
                    <td><span className="badge badge-pix">{item.formaPagamento}</span></td>
                    <td className={`money ${item.tipo === "ENTRADA" ? "positive" : "negative"}`}>
                      {moeda.format(item.valor)}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-outline btn-sm" type="button" onClick={() => abrirEdicao(item)}>Editar</button>
                        <button className="btn btn-danger btn-sm" type="button" onClick={() => excluirMovimento(item)}>Excluir</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {movimentosFiltrados.length === 0 && (
            <div className="empty-state">
              <div className="icon"><i className="bi bi-cash-coin" aria-hidden="true"></i></div>
              <p>{movimentos.length === 0 ? "Nenhuma movimentacao encontrada." : "Nenhuma movimentacao encontrada para os filtros selecionados."}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
