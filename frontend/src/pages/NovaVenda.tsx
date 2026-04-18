import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/api";

type LoteVenda = {
  id: number;
  produto: string;
};

export default function NovaVenda() {
  const navigate = useNavigate();

  const [lotes, setLotes] = useState<LoteVenda[]>([]);
  const [form, setForm] = useState({
    comprador: "",
    loteVendaId: "",
    quantidade: 1,
    valorPago: 0,
    valorPix: 0,
    valorDinheiro: 0,
    formaPagamento: "PIX",
    numeroParcelas: 1,
    parcelaAtual: 1,
    observacao: ""
  });

  useEffect(() => {
    async function carregarLotes() {
      try {
        const response = await api.get("/lotes-venda");
        setLotes(response.data);
      } catch (error) {
        console.error("Erro ao carregar lotes", error);
      }
    }

    carregarLotes();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();

    try {
      const valorPix = form.formaPagamento === "MISTO" ? Number(form.valorPix || 0) : undefined;
      const valorDinheiro = form.formaPagamento === "MISTO" ? Number(form.valorDinheiro || 0) : undefined;

      await api.post("/vendas", {
        ...form,
        loteVendaId: Number(form.loteVendaId),
        quantidade: Number(form.quantidade),
        valorPago: Number(form.valorPago),
        valorPix,
        valorDinheiro,
        numeroParcelas: Number(form.numeroParcelas),
        parcelaAtual: Number(form.parcelaAtual)
      });

      alert("Venda salva com sucesso");
      navigate("/vendas");
    } catch {
      alert("Erro ao salvar venda");
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h2>Nova Venda</h2>
        <p>Registre uma venda do departamento</p>
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        <form onSubmit={salvar}>
          <div className="form-group">
            <label>Comprador *</label>
            <input className="form-control" name="comprador" placeholder="Nome da pessoa que comprou" value={form.comprador} onChange={handleChange} />
          </div>

          {form.formaPagamento === "MISTO" && (
            <div className="form-row">
              <div className="form-group">
                <label>Valor em PIX (R$)</label>
                <input className="form-control" name="valorPix" type="number" min="0" step="0.01" value={form.valorPix} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Valor em Dinheiro (R$)</label>
                <input className="form-control" name="valorDinheiro" type="number" min="0" step="0.01" value={form.valorDinheiro} onChange={handleChange} />
              </div>
            </div>
          )}

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
            <label>Venda ativa *</label>
            <select className="form-control" name="loteVendaId" value={form.loteVendaId} onChange={handleChange}>
              <option value="">Selecione um lote</option>
              {lotes.map((lote) => (
                <option key={lote.id} value={lote.id}>{lote.produto}</option>
              ))}
            </select>
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
            <label>Observação</label>
            <input className="form-control" name="observacao" placeholder="Opcional" value={form.observacao} onChange={handleChange} />
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
            <button className="btn btn-outline" type="button" onClick={() => navigate("/vendas")}>Cancelar</button>
            <button className="btn btn-primary" type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
