import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/api";
import { limitInputValue } from "../utils/formLimits";

type Congregacao = {
  id: number;
  nome: string;
};

export default function NovaMulher() {
  const navigate = useNavigate();

  const [congregacoes, setCongregacoes] = useState<Congregacao[]>([]);
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    congregacaoId: ""
  });

  useEffect(() => {
    async function carregarCongregacoes() {
      try {
        const response = await api.get("/congregacoes");
        setCongregacoes(response.data);
      } catch (error) {
        console.error("Erro ao carregar congregações", error);
      }
    }

    carregarCongregacoes();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({
      ...form,
      [e.target.name]: limitInputValue(e.target.name, e.target.value)
    });
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();

    try {
      await api.post("/mulheres", {
        ...form,
        congregacaoId: Number(form.congregacaoId)
      });

      alert("Mulher salva com sucesso");
      navigate("/mulheres");
    } catch (error) {
      alert("Erro ao salvar mulher");
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h2>Nova Mulher</h2>
        <p>Cadastre uma mulher vinculada a uma congregação</p>
      </div>

      <div className="card" style={{ maxWidth: 520 }}>
        <form onSubmit={salvar}>
          <div className="form-group">
            <label>Nome *</label>
            <input className="form-control" name="nome" placeholder="Nome completo" value={form.nome} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Congregação *</label>
            <select className="form-control" name="congregacaoId" value={form.congregacaoId} onChange={handleChange}>
              <option value="">Selecione uma congregação</option>
              {congregacoes.map((item) => (
                <option key={item.id} value={item.id}>{item.nome}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Telefone</label>
            <input className="form-control" name="telefone" placeholder="(00) 00000-0000" maxLength={15} value={form.telefone} onChange={handleChange} />
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
            <button className="btn btn-outline" type="button" onClick={() => navigate("/mulheres")}>Cancelar</button>
            <button className="btn btn-primary" type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
