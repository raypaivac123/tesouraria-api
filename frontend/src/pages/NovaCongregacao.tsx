import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/api";

export default function NovaCongregacao() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    cidade: "",
    pastor: ""
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();

    try {
      await api.post("/congregacoes", form);
      alert("Congregação salva com sucesso");
      navigate("/congregacoes");
    } catch (error) {
      console.error("Erro ao salvar congregação", error);
      alert("Erro ao salvar congregação");
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h2>Nova Congregação</h2>
        <p>Cadastre uma nova congregação</p>
      </div>

      <div className="card" style={{ maxWidth: 460 }}>
        <form onSubmit={salvar}>
          <div className="form-group">
            <label>Nome da Congregação *</label>
            <input className="form-control" name="nome" placeholder="Ex: Sede Brasília" value={form.nome} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Cidade</label>
            <input className="form-control" name="cidade" placeholder="Cidade" value={form.cidade} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Pastor</label>
            <input className="form-control" name="pastor" placeholder="Pastor responsável" value={form.pastor} onChange={handleChange} />
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
            <button className="btn btn-outline" type="button" onClick={() => navigate("/congregacoes")}>Cancelar</button>
            <button className="btn btn-primary" type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
