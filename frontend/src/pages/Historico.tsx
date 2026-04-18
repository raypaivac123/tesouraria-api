import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/api";

type HistoricoItem = {
  id: number;
  entidade: string;
  entidadeId: number;
  acao: string;
  descricao: string;
  dataHora: string;
};

function formatarDataHora(dataHora: string) {
  if (!dataHora) return "-";
  return new Date(dataHora).toLocaleString("pt-BR");
}

export default function Historico() {
  const [itens, setItens] = useState<HistoricoItem[]>([]);

  useEffect(() => {
    async function carregar() {
      try {
        const response = await api.get("/historico");
        setItens(response.data);
      } catch (error) {
        console.error("Erro ao carregar historico", error);
      }
    }

    carregar();
  }, []);

  return (
    <Layout>
      <div className="page-header">
        <h2><i className="bi bi-clock-history" aria-hidden="true"></i> Historico de Alteracoes</h2>
        <p>Acompanhe criacoes, atualizacoes, exclusoes e baixas automaticas</p>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Entidade</th>
                <th>ID</th>
                <th>Acao</th>
                <th>Descricao</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item) => (
                <tr key={item.id}>
                  <td>{formatarDataHora(item.dataHora)}</td>
                  <td>{item.entidade}</td>
                  <td>{item.entidadeId}</td>
                  <td><span className="badge badge-pix">{item.acao}</span></td>
                  <td>{item.descricao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {itens.length === 0 && (
          <div className="empty-state">
            <div className="icon"><i className="bi bi-clock-history" aria-hidden="true"></i></div>
            <p>Nenhuma alteracao registrada ainda.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
