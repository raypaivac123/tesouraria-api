import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/api";

export default function NovoMovimento() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    data: "",
    tipo: "ENTRADA",
    descricao: "",
    categoria: "",
    formaPagamento: "PIX",
    valor: 0
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/caixa", {
      ...form,
      valor: Number(form.valor)
    });
    alert("Salvo com sucesso");
    navigate("/caixa");
  }

  return (
    <Layout>
      <div className="page-header">
        <h2>Nova Movimentação</h2>
        <p>Registre uma entrada ou saída financeira</p>
      </div>

      <div className="card" style={{ maxWidth: 620 }}>
        <form onSubmit={salvar}>
          <div className="form-row">
            <div className="form-group">
              <label>Tipo *</label>
              <select className="form-control" name="tipo" value={form.tipo} onChange={handleChange}>
                <option value="ENTRADA">Entrada</option>
                <option value="SAIDA">Saída</option>
              </select>
            </div>
            <div className="form-group">
              <label>Data *</label>
              <input className="form-control" name="data" type="date" value={form.data} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Descrição *</label>
            <input className="form-control" name="descricao" placeholder="Descrição da movimentação" value={form.descricao} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Categoria *</label>
              <input className="form-control" name="categoria" placeholder="Categoria" value={form.categoria} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Forma de Pagamento *</label>
              <select className="form-control" name="formaPagamento" value={form.formaPagamento} onChange={handleChange}>
                <option value="PIX">PIX</option>
                <option value="DINHEIRO">Dinheiro</option>
                <option value="CARTAO">Cartão</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Valor (R$) *</label>
            <input className="form-control" name="valor" type="number" min="0" step="0.01" placeholder="0,00" value={form.valor} onChange={handleChange} />
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
            <button className="btn btn-outline" type="button" onClick={() => navigate("/caixa")}>Cancelar</button>
            <button className="btn btn-primary" type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
