import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import api from "../api/api";
import { limitInputValue } from "../utils/formLimits";

type Congregacao = {
  id: number;
  nome: string;
};

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

export default function NovoUniformePandeiro() {
  const navigate = useNavigate();

  const [congregacoes, setCongregacoes] = useState<Congregacao[]>([]);
  const [form, setForm] = useState({
    nomeMulher: "",
    telefone: "",
    congregacaoId: "",
    nomeUniforme: "Uniforme Pandeiro",
    valorUniforme: "",
    valorPix: "",
    valorDinheiro: "",
    dataPagamento: "",
    observacao: ""
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

    const valorPix = Number(form.valorPix || 0);
    const valorDinheiro = Number(form.valorDinheiro || 0);

    if (valorPix + valorDinheiro > 0 && !form.dataPagamento) {
      alert("Informe a data do pagamento");
      return;
    }

    try {
      await api.post("/uniforme-pandeiro", {
        ...form,
        congregacaoId: Number(form.congregacaoId),
        valorUniforme: Number(form.valorUniforme),
        valorPix,
        valorDinheiro,
        dataPagamento: form.dataPagamento || null
      });

      alert("Uniforme pandeiro salvo com sucesso");
      navigate("/uniforme-pandeiro");
    } catch (error) {
      console.error("Erro ao salvar uniforme pandeiro", error);
      alert(mensagemErroApi(error, "salvar uniforme pandeiro"));
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h2>Novo Registro - Uniforme Pandeiro</h2>
        <p>Registre pagamentos do uniforme do pandeiro</p>
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        <form onSubmit={salvar}>
          <div className="form-row">
            <div className="form-group">
              <label>Nome da Mulher *</label>
              <input className="form-control" name="nomeMulher" placeholder="Nome completo" value={form.nomeMulher} onChange={handleChange} />
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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nome do Uniforme</label>
              <input className="form-control" name="nomeUniforme" value={form.nomeUniforme} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input className="form-control" name="telefone" placeholder="(00) 00000-0000" maxLength={15} value={form.telefone} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Valor Total (R$) *</label>
              <input className="form-control" name="valorUniforme" type="number" min="0" step="0.01" placeholder="80,00" value={form.valorUniforme} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Data do Pagamento</label>
              <input className="form-control" name="dataPagamento" type="date" value={form.dataPagamento} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Valor em PIX (R$)</label>
              <input className="form-control" name="valorPix" type="number" min="0" step="0.01" placeholder="0,00" value={form.valorPix} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Valor em Dinheiro (R$)</label>
              <input className="form-control" name="valorDinheiro" type="number" min="0" step="0.01" placeholder="0,00" value={form.valorDinheiro} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Observação</label>
            <input className="form-control" name="observacao" placeholder="Opcional" value={form.observacao} onChange={handleChange} />
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
            <button className="btn btn-outline" type="button" onClick={() => navigate("/uniforme-pandeiro")}>Cancelar</button>
            <button className="btn btn-primary" type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
