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

type Mulher = {
  id: number;
  nome: string;
  telefone: string;
  congregacaoId: number;
  nomeCongregacao: string;
  ativo: boolean;
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

export default function NovoUniformeFestividade() {
  const navigate = useNavigate();

  const [congregacoes, setCongregacoes] = useState<Congregacao[]>([]);
  const [mulheres, setMulheres] = useState<Mulher[]>([]);
  const [mulherSelecionadaId, setMulherSelecionadaId] = useState("");
  const [form, setForm] = useState({
    nomeMulher: "",
    telefone: "",
    congregacaoId: "",
    nomeUniforme: "Uniforme Festividade",
    valorUniforme: "",
    valorPix: "",
    valorDinheiro: "",
    numeroParcelas: 1,
    parcelaAtual: 1,
    dataPagamento: "",
    observacao: ""
  });

  useEffect(() => {
    async function carregarDados() {
      try {
        const [congregacoesResponse, mulheresResponse] = await Promise.all([
          api.get("/congregacoes"),
          api.get("/mulheres")
        ]);

        setCongregacoes(congregacoesResponse.data);
        setMulheres(mulheresResponse.data);
      } catch (error) {
        console.error("Erro ao carregar dados do formulário", error);
      }
    }

    carregarDados();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({
      ...form,
      [e.target.name]: limitInputValue(e.target.name, e.target.value)
    });
  }

  function handleMulherChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const mulherId = e.target.value;
    const mulher = mulheres.find((item) => String(item.id) === mulherId);

    setMulherSelecionadaId(mulherId);
    setForm({
      ...form,
      nomeMulher: mulher?.nome || "",
      telefone: mulher?.telefone || "",
      congregacaoId: mulher ? String(mulher.congregacaoId) : ""
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
      await api.post("/uniforme-festividade", {
        ...form,
        congregacaoId: Number(form.congregacaoId),
        valorUniforme: Number(form.valorUniforme),
        valorPix,
        valorDinheiro,
        numeroParcelas: Number(form.numeroParcelas),
        parcelaAtual: Number(form.parcelaAtual),
        dataPagamento: form.dataPagamento || null
      });

      alert("Uniforme festividade salvo com sucesso");
      navigate("/uniforme-festividade");
    } catch (error) {
      console.error("Erro ao salvar uniforme festividade", error);
      alert(mensagemErroApi(error, "salvar uniforme festividade"));
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h2>Novo Registro - Uniforme Festividade</h2>
        <p>Registre pagamentos do uniforme da festividade</p>
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        <form onSubmit={salvar}>
          <div className="form-row">
            <div className="form-group">
              <label>Nome da Mulher *</label>
              <select className="form-control" value={mulherSelecionadaId} onChange={handleMulherChange} required>
                <option value="">Selecione uma mulher cadastrada</option>
                {mulheres.filter((item) => item.ativo !== false).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome}{item.nomeCongregacao ? ` - ${item.nomeCongregacao}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Congregação *</label>
              <select className="form-control" name="congregacaoId" value={form.congregacaoId} onChange={handleChange} disabled={Boolean(mulherSelecionadaId)}>
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
              <input className="form-control" name="valorUniforme" type="number" min="0" step="0.01" placeholder="100,00" value={form.valorUniforme} onChange={handleChange} />
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

          <div className="form-row">
            <div className="form-group">
              <label>Total de Parcelas</label>
              <input className="form-control" name="numeroParcelas" type="number" min="1" step="1" value={form.numeroParcelas} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Parcela Atual</label>
              <input className="form-control" name="parcelaAtual" type="number" min="1" step="1" value={form.parcelaAtual} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Observação</label>
            <input className="form-control" name="observacao" placeholder="Opcional" value={form.observacao} onChange={handleChange} />
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
            <button className="btn btn-outline" type="button" onClick={() => navigate("/uniforme-festividade")}>Cancelar</button>
            <button className="btn btn-primary" type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
