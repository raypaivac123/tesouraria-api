import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import api from "../api/api";
import { limitInputValue } from "../utils/formLimits";

type ItemFestividade = {
  id: number;
  nomeMulher: string;
  telefone: string;
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
  observacao: string;
};

type Congregacao = {
  id: number;
  nome: string;
};

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function statusClass(status: string) {
  if (status?.includes("PAGO") && !status?.includes("PARCIAL")) return "badge-pago";
  if (status?.includes("PARCIAL")) return "badge-parcial";
  return "badge-pend";
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

export default function UniformeFestividade() {
  const [itens, setItens] = useState<ItemFestividade[]>([]);
  const [congregacoes, setCongregacoes] = useState<Congregacao[]>([]);
  const [busca, setBusca] = useState("");
  const [congregacaoFiltro, setCongregacaoFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [editando, setEditando] = useState<ItemFestividade | null>(null);
  const [form, setForm] = useState({
    nomeMulher: "",
    telefone: "",
    congregacaoId: "",
    nomeUniforme: "",
    valorUniforme: "",
    valorPix: "",
    valorDinheiro: "",
    dataPagamento: "",
    observacao: ""
  });

  async function carregar() {
    try {
      const [uniformesResponse, congregacoesResponse] = await Promise.all([
        api.get("/uniforme-festividade"),
        api.get("/congregacoes")
      ]);
      setItens(uniformesResponse.data);
      setCongregacoes(congregacoesResponse.data);
    } catch (error) {
      console.error("Erro ao carregar uniformes festividade", error);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function abrirEdicao(item: ItemFestividade) {
    setEditando(item);
    setForm({
      nomeMulher: item.nomeMulher || "",
      telefone: item.telefone || "",
      congregacaoId: String(item.congregacaoId || ""),
      nomeUniforme: item.nomeUniforme || "",
      valorUniforme: String(item.valorUniforme || ""),
      valorPix: String(item.valorPix || ""),
      valorDinheiro: String(item.valorDinheiro || ""),
      dataPagamento: item.dataPagamento || "",
      observacao: item.observacao || ""
    });
  }

  function cancelarEdicao() {
    setEditando(null);
    setForm({
      nomeMulher: "",
      telefone: "",
      congregacaoId: "",
      nomeUniforme: "",
      valorUniforme: "",
      valorPix: "",
      valorDinheiro: "",
      dataPagamento: "",
      observacao: ""
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: limitInputValue(e.target.name, e.target.value) });
  }

  async function salvarEdicao(e: React.FormEvent) {
    e.preventDefault();
    if (!editando) return;

    const valorPix = Number(form.valorPix || 0);
    const valorDinheiro = Number(form.valorDinheiro || 0);

    if (valorPix + valorDinheiro > 0 && !form.dataPagamento) {
      alert("Informe a data do pagamento");
      return;
    }

    try {
      await api.put(`/uniforme-festividade/${editando.id}`, {
        ...form,
        congregacaoId: Number(form.congregacaoId),
        valorUniforme: Number(form.valorUniforme),
        valorPix,
        valorDinheiro,
        dataPagamento: form.dataPagamento || null
      });
      cancelarEdicao();
      await carregar();
      alert("Uniforme atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar uniforme festividade", error);
      alert(mensagemErroApi(error, "atualizar uniforme"));
    }
  }

  async function excluirItem(item: ItemFestividade) {
    if (!window.confirm(`Deseja excluir o registro de "${item.nomeMulher}"?`)) return;

    try {
      await api.delete(`/uniforme-festividade/${item.id}`);
      await carregar();
      alert("Registro excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir uniforme festividade", error);
      alert(mensagemErroApi(error, "excluir registro"));
    }
  }

  const resumo = useMemo(() => ({
    arrecadado: itens.reduce((acc, item) => acc + Number(item.totalPago), 0),
    pendente: itens.reduce((acc, item) => acc + Number(item.saldoPendente), 0),
    quitadas: itens.filter((item) => Number(item.saldoPendente) <= 0).length,
    pendentes: itens.filter((item) => Number(item.saldoPendente) > 0).length
  }), [itens]);

  const itensFiltrados = useMemo(() => {
    const texto = busca.trim().toLowerCase();

    return itens.filter((item) => {
      const correspondeBusca = !texto || [
        item.nomeMulher,
        item.nomeCongregacao,
        item.nomeUniforme,
        item.telefone
      ]
        .filter(Boolean)
        .some((valor) => valor.toLowerCase().includes(texto));

      const correspondeCongregacao = !congregacaoFiltro ||
        String(item.congregacaoId) === congregacaoFiltro;

      const status = item.statusPagamento || "";
      const correspondeStatus = !statusFiltro ||
        (statusFiltro === "PAGO" && status.includes("PAGO") && !status.includes("PARCIAL")) ||
        (statusFiltro === "PARCIAL" && status.includes("PARCIAL")) ||
        (statusFiltro === "PENDENTE" && !status.includes("PAGO"));

      return correspondeBusca && correspondeCongregacao && correspondeStatus;
    });
  }, [busca, congregacaoFiltro, itens, statusFiltro]);

  return (
    <Layout>
      <div className="page-header">
        <h2><i className="bi bi-bag-heart" aria-hidden="true"></i> Uniforme da Festividade</h2>
        <p>Controle de pagamentos do uniforme da festividade</p>
      </div>

      <div className="grid-4" style={{ marginBottom: 20 }}>
        <div className="stat-card green"><div className="stat-label">Total Arrecadado</div><div className="stat-value small">{moeda.format(resumo.arrecadado)}</div></div>
        <div className="stat-card red"><div className="stat-label">Total Pendente</div><div className="stat-value small">{moeda.format(resumo.pendente)}</div></div>
        <div className="stat-card"><div className="stat-label">Pagas Integralmente</div><div className="stat-value small">{resumo.quitadas}</div></div>
        <div className="stat-card orange"><div className="stat-label">Pendentes / Parciais</div><div className="stat-value small">{resumo.pendentes}</div></div>
      </div>

      <div className="page-actions">
        <div className="filters-bar">
          <input
            className="form-control"
            type="text"
            placeholder="Buscar nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <select
            className="form-control"
            value={congregacaoFiltro}
            onChange={(e) => setCongregacaoFiltro(e.target.value)}
          >
            <option value="">Todas as congregações</option>
            {congregacoes.map((item) => (
              <option key={item.id} value={item.id}>{item.nome}</option>
            ))}
          </select>
          <select
            className="form-control"
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="PAGO">Pago integralmente</option>
            <option value="PARCIAL">Pago parcialmente</option>
            <option value="PENDENTE">Não pago</option>
          </select>
        </div>
        <Link className="btn btn-primary" to="/novo-uniforme-festividade">
          <i className="bi bi-plus-lg" aria-hidden="true"></i> Novo Registro
        </Link>
      </div>

      {editando && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-title">Editar Uniforme Festividade</div>
          <form onSubmit={salvarEdicao}>
            <div className="form-row">
              <div className="form-group"><label>Nome *</label><input className="form-control" name="nomeMulher" value={form.nomeMulher} onChange={handleChange} /></div>
              <div className="form-group"><label>Congregação *</label><select className="form-control" name="congregacaoId" value={form.congregacaoId} onChange={handleChange}><option value="">Selecione</option>{congregacoes.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}</select></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Uniforme</label><input className="form-control" name="nomeUniforme" value={form.nomeUniforme} onChange={handleChange} /></div>
              <div className="form-group"><label>Telefone</label><input className="form-control" name="telefone" maxLength={15} value={form.telefone} onChange={handleChange} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Valor Total *</label><input className="form-control" name="valorUniforme" type="number" value={form.valorUniforme} onChange={handleChange} /></div>
              <div className="form-group"><label>Data Pagamento</label><input className="form-control" name="dataPagamento" type="date" value={form.dataPagamento} onChange={handleChange} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>PIX</label><input className="form-control" name="valorPix" type="number" value={form.valorPix} onChange={handleChange} /></div>
              <div className="form-group"><label>Dinheiro</label><input className="form-control" name="valorDinheiro" type="number" value={form.valorDinheiro} onChange={handleChange} /></div>
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button className="btn btn-outline" type="button" onClick={cancelarEdicao}>Cancelar</button>
              <button className="btn btn-primary" type="submit">Salvar Alterações</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Nome</th><th>Congregação</th><th>Uniforme</th><th>Valor Total</th><th>Total Pago</th><th>Pendente</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>
              {itensFiltrados.map((item) => (
                <tr key={item.id}>
                  <td>{item.nomeMulher}</td>
                  <td>{item.nomeCongregacao}</td>
                  <td>{item.nomeUniforme}</td>
                  <td className="money">{moeda.format(item.valorUniforme)}</td>
                  <td className="money positive">{moeda.format(item.totalPago)}</td>
                  <td className="money negative">{moeda.format(item.saldoPendente)}</td>
                  <td><span className={`badge ${statusClass(item.statusPagamento)}`}>{item.statusPagamento}</span></td>
                  <td><div style={{ display: "flex", gap: 8 }}><button className="btn btn-outline btn-sm" type="button" onClick={() => abrirEdicao(item)}>Editar</button><button className="btn btn-danger btn-sm" type="button" onClick={() => excluirItem(item)}>Excluir</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {itensFiltrados.length === 0 && <div className="empty-state"><div className="icon"><i className="bi bi-bag-heart" aria-hidden="true"></i></div><p>Nenhum registro encontrado.</p></div>}
      </div>
    </Layout>
  );
}
