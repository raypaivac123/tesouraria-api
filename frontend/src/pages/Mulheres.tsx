import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/api";
import { limitInputValue } from "../utils/formLimits";

type Mulher = {
  id: number;
  nome: string;
  telefone: string;
  congregacaoId: number;
  nomeCongregacao: string;
  ativo: boolean;
};

type Congregacao = {
  id: number;
  nome: string;
};

export default function Mulheres() {
  const [mulheres, setMulheres] = useState<Mulher[]>([]);
  const [congregacoes, setCongregacoes] = useState<Congregacao[]>([]);
  const [editando, setEditando] = useState<Mulher | null>(null);
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    congregacaoId: ""
  });

  async function carregarDados() {
    try {
      const [mulheresResponse, congregacoesResponse] = await Promise.all([
        api.get("/mulheres"),
        api.get("/congregacoes")
      ]);

      setMulheres(mulheresResponse.data);
      setCongregacoes(congregacoesResponse.data);
    } catch (error) {
      console.error("Erro ao carregar mulheres", error);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function abrirEdicao(item: Mulher) {
    setEditando(item);
    setForm({
      nome: item.nome,
      telefone: item.telefone || "",
      congregacaoId: String(item.congregacaoId)
    });
  }

  function cancelarEdicao() {
    setEditando(null);
    setForm({ nome: "", telefone: "", congregacaoId: "" });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({
      ...form,
      [e.target.name]: limitInputValue(e.target.name, e.target.value)
    });
  }

  async function salvarEdicao(e: React.FormEvent) {
    e.preventDefault();

    if (!editando) {
      return;
    }

    try {
      await api.put(`/mulheres/${editando.id}`, {
        ...form,
        congregacaoId: Number(form.congregacaoId)
      });
      cancelarEdicao();
      await carregarDados();
      alert("Mulher atualizada com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar mulher", error);
      alert("Erro ao atualizar mulher");
    }
  }

  async function excluirMulher(item: Mulher) {
    if (!window.confirm(`Deseja excluir "${item.nome}"?`)) {
      return;
    }

    try {
      await api.delete(`/mulheres/${item.id}`);
      await carregarDados();
      alert("Mulher excluída com sucesso");
    } catch (error) {
      console.error("Erro ao excluir mulher", error);
      alert("Erro ao excluir mulher");
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h2>Mulheres</h2>
        <p>Cadastro de mulheres por congregação</p>
      </div>

      <div className="page-actions">
        <div className="filters-bar">
          <input className="form-control" type="text" placeholder="Buscar nome..." disabled />
          <select className="form-control" disabled>
            <option>Todas as congregações</option>
          </select>
        </div>
        <Link className="btn btn-primary" to="/nova-mulher">
          <i className="bi bi-plus-lg" aria-hidden="true"></i> Nova Mulher
        </Link>
      </div>

      {editando && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-title">Editar Mulher</div>
          <form onSubmit={salvarEdicao}>
            <div className="form-row-3">
              <div className="form-group">
                <label>Nome *</label>
                <input className="form-control" name="nome" value={form.nome} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input className="form-control" name="telefone" maxLength={15} value={form.telefone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Congregação *</label>
                <select className="form-control" name="congregacaoId" value={form.congregacaoId} onChange={handleChange}>
                  <option value="">Selecione</option>
                  {congregacoes.map((item) => (
                    <option key={item.id} value={item.id}>{item.nome}</option>
                  ))}
                </select>
              </div>
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
            <thead>
              <tr>
                <th>Nome</th>
                <th>Congregação</th>
                <th>Telefone</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {mulheres.map((item) => (
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>{item.nomeCongregacao}</td>
                  <td>{item.telefone || "-"}</td>
                  <td>
                    <span className={`badge ${item.ativo ? "badge-pago" : "badge-pend"}`}>
                      {item.ativo ? "Ativa" : "Inativa"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-outline btn-sm" type="button" onClick={() => abrirEdicao(item)}>Editar</button>
                      <button className="btn btn-danger btn-sm" type="button" onClick={() => excluirMulher(item)}>Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {mulheres.length === 0 && (
          <div className="empty-state">
            <div className="icon"><i className="bi bi-people" aria-hidden="true"></i></div>
            <p>Nenhuma mulher cadastrada.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
