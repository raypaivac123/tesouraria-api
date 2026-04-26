import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import api from "../api/api";

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

export default function NovoMovimento() {
  const navigate = useNavigate();

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();

    try {
      await api.post("/caixa", {
        ...form,
        valor: Number(form.valor),
        valorPix: form.formaPagamento === "MISTO" ? Number(form.valorPix || 0) : undefined,
        valorDinheiro: form.formaPagamento === "MISTO" ? Number(form.valorDinheiro || 0) : undefined,
        justificativa: form.tipo === "SAIDA" ? form.justificativa : undefined
      });

      alert("Movimento salvo com sucesso");
      navigate("/caixa");
    } catch (error) {
      alert(mensagemErroApi(error, "salvar movimento"));
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h2>Nova Movimentacao</h2>
        <p>Registre uma entrada ou saida financeira</p>
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        <form onSubmit={salvar}>
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

          <div className="form-group">
            <label>Descricao *</label>
            <input className="form-control" name="descricao" placeholder="Descricao da movimentacao" value={form.descricao} onChange={handleChange} />
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
                <option value="MISTO">Misto</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Valor (R$) *</label>
            <input className="form-control" name="valor" type="number" min="0" step="0.01" placeholder="0,00" value={form.valor} onChange={handleChange} />
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
              <input className="form-control" name="justificativa" placeholder="Informe o motivo da saida" value={form.justificativa} onChange={handleChange} />
            </div>
          )}

          <div className="form-group">
            <label>Observacao</label>
            <input className="form-control" name="observacao" placeholder="Opcional" value={form.observacao} onChange={handleChange} />
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
