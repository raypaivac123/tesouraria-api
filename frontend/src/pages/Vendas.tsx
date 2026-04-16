import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import api from "../api/api";

type Venda = {
  id: number;
  comprador: string;
  loteVendaId: number;
  produto: string;
  quantidade: number;
  total: number;
  custoTotal: number;
  lucroPrevisto: number;
  valorPago: number;
  pendente: number;
  formaPagamento: string;
  statusPagamento: string;
  observacao: string;
};

type LoteVenda = {
  id: number;
  produto: string;
  categoria: string;
  dataVenda: string;
  custoUnitario: number;
  valorUnitario: number;
  observacao: string;
};

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function formatarData(data: string) {
  if (!data) return "-";
  const [ano, mes, dia] = data.split("-");
  return dia && mes && ano ? `${dia}/${mes}/${ano}` : data;
}

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

  if (status === 404 || status === 405) {
    return `Erro ao ${acao}: reinicie o backend para ativar a rota de edicao de vendas.`;
  }

  if (erro) {
    return `Erro ao ${acao}: ${erro}`;
  }

  return `Erro ao ${acao}${status ? ` (${status})` : ""}`;
}

export default function Vendas() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [lotes, setLotes] = useState<LoteVenda[]>([]);
  const [loteSelecionado, setLoteSelecionado] = useState("");
  const [editando, setEditando] = useState<Venda | null>(null);
  const [form, setForm] = useState({
    comprador: "",
    loteVendaId: "",
    quantidade: 1,
    valorPago: 0,
    formaPagamento: "PIX",
    observacao: ""
  });

  async function carregar() {
    try {
      const [vendasResponse, lotesResponse] = await Promise.all([
        api.get("/vendas"),
        api.get("/lotes-venda")
      ]);

      setVendas(vendasResponse.data);
      setLotes(lotesResponse.data);

      if (lotesResponse.data.length > 0 && !loteSelecionado) {
        setLoteSelecionado(String(lotesResponse.data[0].id));
      }
    } catch (error) {
      console.error("Erro ao carregar vendas", error);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const loteAtual = lotes.find((lote) => String(lote.id) === loteSelecionado);

  function abrirEdicao(item: Venda) {
    setEditando(item);
    setForm({
      comprador: item.comprador || "",
      loteVendaId: String(item.loteVendaId || ""),
      quantidade: Number(item.quantidade || 1),
      valorPago: Number(item.valorPago || 0),
      formaPagamento: item.formaPagamento || "PIX",
      observacao: item.observacao || ""
    });
  }

  function cancelarEdicao() {
    setEditando(null);
    setForm({
      comprador: "",
      loteVendaId: "",
      quantidade: 1,
      valorPago: 0,
      formaPagamento: "PIX",
      observacao: ""
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
      await api.put(`/vendas/${editando.id}`, {
        ...form,
        loteVendaId: Number(form.loteVendaId),
        quantidade: Number(form.quantidade),
        valorPago: Number(form.valorPago)
      });

      cancelarEdicao();
      await carregar();
      alert("Venda atualizada com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar venda", error);
      alert(mensagemErroApi(error, "atualizar venda"));
    }
  }

  async function excluirVenda(item: Venda) {
    if (!window.confirm(`Deseja excluir a venda de "${item.comprador}"?`)) {
      return;
    }

    try {
      await api.delete(`/vendas/${item.id}`);
      await carregar();
      alert("Venda excluida com sucesso");
    } catch (error) {
      console.error("Erro ao excluir venda", error);
      alert(mensagemErroApi(error, "excluir venda"));
    }
  }

  const resumo = useMemo(() => ({
    total: vendas.reduce((acc, item) => acc + Number(item.total), 0),
    custo: vendas.reduce((acc, item) => acc + Number(item.custoTotal || 0), 0),
    lucro: vendas.reduce((acc, item) => acc + Number(item.valorPago || 0) - Number(item.custoTotal || 0), 0),
    pago: vendas.reduce((acc, item) => acc + Number(item.valorPago), 0),
    pendente: vendas.reduce((acc, item) => acc + Number(item.pendente), 0),
    itens: vendas.reduce((acc, item) => acc + Number(item.quantidade), 0)
  }), [vendas]);

  return (
    <Layout>
      <div className="page-header">
        <h2><i className="bi bi-cart3" aria-hidden="true"></i> Vendas e Arrecadações</h2>
        <p>Registre as vendas de produtos do departamento</p>
      </div>

      <div className="grid-auto" style={{ marginBottom: 20 }}>
        <div className="stat-card green">
          <div className="stat-label">Total Arrecadado</div>
          <div className="stat-value">{moeda.format(resumo.pago)}</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Custo</div>
          <div className="stat-value small">{moeda.format(resumo.custo)}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Lucro Realizado</div>
          <div className="stat-value small">{moeda.format(resumo.lucro)}</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Pendente</div>
          <div className="stat-value small">{moeda.format(resumo.pendente)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total de Vendas</div>
          <div className="stat-value small">{vendas.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Itens Vendidos</div>
          <div className="stat-value small">{resumo.itens}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Bloco de venda</div>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div className="form-group" style={{ margin: 0, minWidth: 390 }}>
            <label>Venda ativa</label>
            <select className="form-control" value={loteSelecionado} onChange={(e) => setLoteSelecionado(e.target.value)}>
              {lotes.length === 0 && <option>Nenhum lote cadastrado</option>}
              {lotes.map((lote) => (
                <option key={lote.id} value={lote.id}>
                  {lote.produto} - {formatarData(lote.dataVenda)}
                </option>
              ))}
            </select>
          </div>
          <Link className="btn btn-primary" to="/nova-venda">
            <i className="bi bi-plus-lg" aria-hidden="true"></i> novo Bloco
          </Link>
          <button className="btn btn-outline" type="button">Editar Bloco</button>
          <button className="btn btn-danger" type="button">Excluir Bloco</button>
        </div>

        {loteAtual && (
          <div className="grid-4" style={{ marginTop: 24 }}>
            <div>
              <strong>Produto:</strong>
              <br />
              {loteAtual.produto}
            </div>
            <div>
              <strong>Categoria:</strong>
              <br />
              {loteAtual.categoria || "-"}
            </div>
            <div>
              <strong>Custo unit.:</strong>
              <br />
              {moeda.format(loteAtual.custoUnitario || 0)}
            </div>
            <div>
              <strong>Venda unit.:</strong>
              <br />
              {moeda.format(loteAtual.valorUnitario || 0)}
            </div>
          </div>
        )}

        {loteAtual?.observacao && (
          <p style={{ marginTop: 18, color: "var(--text-muted)" }}>
            <strong>Obs.:</strong> {loteAtual.observacao}
          </p>
        )}
      </div>

      <div className="page-actions">
        <div className="filters-bar">
          <input className="form-control" type="text" placeholder="Buscar produto ou comprador..." disabled />
          <input className="form-control" type="date" disabled />
          <input className="form-control" type="date" disabled />
        </div>
        <Link className="btn btn-primary" to="/nova-venda">
          <i className="bi bi-plus-lg" aria-hidden="true"></i> Nova Venda
        </Link>
      </div>

      {editando && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-title">Editar Venda</div>

          <form onSubmit={salvarEdicao}>
            <div className="form-row">
              <div className="form-group">
                <label>Comprador *</label>
                <input className="form-control" name="comprador" value={form.comprador} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Venda ativa *</label>
                <select className="form-control" name="loteVendaId" value={form.loteVendaId} onChange={handleChange}>
                  <option value="">Selecione um lote</option>
                  {lotes.map((lote) => (
                    <option key={lote.id} value={lote.id}>
                      {lote.produto} - {formatarData(lote.dataVenda)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label>Quantidade *</label>
                <input className="form-control" name="quantidade" type="number" min="1" step="1" value={form.quantidade} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Valor Pago (R$)</label>
                <input className="form-control" name="valorPago" type="number" min="0" step="0.01" value={form.valorPago} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Forma de Recebimento</label>
                <select className="form-control" name="formaPagamento" value={form.formaPagamento} onChange={handleChange}>
                  <option value="PIX">PIX</option>
                  <option value="DINHEIRO">Dinheiro</option>
                  <option value="MISTO">Misto</option>
                </select>
              </div>
            </div>

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
                <th>Comprador</th>
                <th>Produto</th>
                <th>Qtde</th>
                <th>Total</th>
                <th>Pago</th>
                <th>Custo</th>
                <th>Lucro Real.</th>
                <th>Pendente</th>
                <th>Forma</th>
                <th>Status</th>
                <th>Observ.</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map((item) => (
                <tr key={item.id}>
                  <td>{item.comprador}</td>
                  <td>{item.produto}</td>
                  <td>{item.quantidade}</td>
                  <td className="money">{moeda.format(item.total)}</td>
                  <td className="money positive">{moeda.format(item.valorPago)}</td>
                  <td className="money negative">{moeda.format(item.custoTotal || 0)}</td>
                  <td className="money positive">{moeda.format(Number(item.valorPago || 0) - Number(item.custoTotal || 0))}</td>
                  <td className="money negative">{moeda.format(item.pendente)}</td>
                  <td><span className="badge badge-pix">{item.formaPagamento}</span></td>
                  <td><span className={`badge ${statusClass(item.statusPagamento)}`}>{item.statusPagamento}</span></td>
                  <td>{item.observacao || "-"}</td>
                  <td>
                    <div style={{ display: "flex", gap: 8, whiteSpace: "nowrap" }}>
                      <button className="btn btn-outline btn-sm" type="button" onClick={() => abrirEdicao(item)}>Editar</button>
                      <button className="btn btn-danger btn-sm" type="button" onClick={() => excluirVenda(item)}>Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {vendas.length === 0 && (
          <div className="empty-state">
            <div className="icon"><i className="bi bi-cart3" aria-hidden="true"></i></div>
            <p>Nenhuma venda registrada ainda.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
