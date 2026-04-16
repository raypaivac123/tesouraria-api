import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import api from "../api/api";

type Congregacao = {
  id: number;
  nome: string;
  cidade: string;
  pastor: string;
  ativo: boolean;
};

export default function Congregacoes() {
  const [congregacoes, setCongregacoes] = useState<Congregacao[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [editando, setEditando] = useState<Congregacao | null>(null);
  const [form, setForm] = useState({
    nome: "",
    cidade: "",
    pastor: ""
  });

  async function carregarCongregacoes() {
    try {
      setCarregando(true);
      setErro("");

      const response = await api.get("/congregacoes");
      const dados = Array.isArray(response.data) ? response.data : response.data.content ?? [];
      setCongregacoes(dados);
    } catch (error) {
      console.error("Erro ao carregar congregações", error);

      if (axios.isAxiosError(error) && error.response) {
        setErro(`Erro ${error.response.status}: ${JSON.stringify(error.response.data)}`);
      } else {
        setErro("Erro ao carregar congregações");
      }
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarCongregacoes();
  }, []);

  function abrirEdicao(item: Congregacao) {
    setEditando(item);
    setForm({
      nome: item.nome,
      cidade: item.cidade || "",
      pastor: item.pastor || ""
    });
  }

  function cancelarEdicao() {
    setEditando(null);
    setForm({
      nome: "",
      cidade: "",
      pastor: ""
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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
      await api.put(`/congregacoes/${editando.id}`, form);
      cancelarEdicao();
      await carregarCongregacoes();
      alert("Congregação atualizada com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar congregação", error);
      alert("Erro ao atualizar congregação");
    }
  }

  async function excluirCongregacao(item: Congregacao) {
    const confirmar = window.confirm(`Deseja excluir a congregação "${item.nome}"?`);

    if (!confirmar) {
      return;
    }

    try {
      await api.delete(`/congregacoes/${item.id}`);
      await carregarCongregacoes();
      alert("Congregação excluída com sucesso");
    } catch (error) {
      console.error("Erro ao excluir congregação", error);
      alert("Erro ao excluir congregação");
    }
  }

  const congregacoesFiltradas = useMemo(() => {
    const texto = busca.trim().toLowerCase();

    if (!texto) {
      return congregacoes;
    }

    return congregacoes.filter((item) =>
      [item.nome, item.cidade, item.pastor]
        .filter(Boolean)
        .some((valor) => valor.toLowerCase().includes(texto))
    );
  }, [busca, congregacoes]);

  return (
    <Layout>
      <div className="congregacoes-page">
        <div className="page-header">
          <h2>Congregações</h2>
          <p>Gerencie as congregações cadastradas</p>
        </div>

        <div className="page-actions">
          <div className="filters-bar">
            <input
              className="form-control search-control"
              type="text"
              placeholder="Buscar congregação..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <Link className="btn btn-primary btn-new-congregacao" to="/nova-congregacao">
            <i className="bi bi-plus-lg" aria-hidden="true"></i> Nova Congregação
          </Link>
        </div>

        {carregando && <p>Carregando...</p>}
        {erro && <div className="alert alert-error">{erro}</div>}

        {editando && (
          <div className="card congregacao-edit-card">
            <div className="card-title">Editar Congregação</div>

            <form onSubmit={salvarEdicao}>
              <div className="form-row-3">
                <div className="form-group">
                  <label>Nome *</label>
                  <input className="form-control" name="nome" value={form.nome} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Cidade</label>
                  <input className="form-control" name="cidade" value={form.cidade} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Pastor</label>
                  <input className="form-control" name="pastor" value={form.pastor} onChange={handleChange} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button className="btn btn-outline" type="button" onClick={cancelarEdicao}>Cancelar</button>
                <button className="btn btn-primary" type="submit">Salvar Alterações</button>
              </div>
            </form>
          </div>
        )}

        {!carregando && !erro && congregacoesFiltradas.length > 0 && (
          <div className="grid-3 congregacoes-grid">
            {congregacoesFiltradas.map((item) => (
              <div className="card congregacao-card" key={item.id}>
                <div className="card-title">{item.nome}</div>
                <p>
                  <i className="bi bi-geo-alt" aria-hidden="true"></i>{" "}
                  {item.cidade || "Cidade não informada"}
                </p>
                <p>
                  <i className="bi bi-person" aria-hidden="true"></i>{" "}
                  {item.pastor || "Pastor não informado"}
                </p>
                <div style={{ marginTop: 12 }}>
                  <span className={`badge ${item.ativo ? "badge-pago" : "badge-pend"}`}>
                    {item.ativo ? "Ativa" : "Inativa"}
                  </span>
                </div>

                <div className="congregacao-card-actions">
                  <button className="btn btn-outline btn-sm" type="button" onClick={() => abrirEdicao(item)}>
                    <i className="bi bi-pencil" aria-hidden="true"></i> Editar
                  </button>
                  <button className="btn btn-danger btn-sm" type="button" onClick={() => excluirCongregacao(item)}>
                    <i className="bi bi-trash" aria-hidden="true"></i> Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!carregando && !erro && congregacoesFiltradas.length === 0 && (
          <div className="empty-state congregacoes-empty">
            <div className="icon"><i className="bi bi-building" aria-hidden="true"></i></div>
            <p>Nenhuma congregação cadastrada.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
