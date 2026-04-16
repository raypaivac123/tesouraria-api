import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/api";

type DashboardData = {
  totalEntradas: number;
  totalSaidas: number;
  saldoAtual: number;
  totalCongregacoes: number;
  totalMulheres: number;
  totalUniformeFestividade: number;
  totalUniformePandeiro: number;
};

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

export default function Dashboard() {
  const [dados, setDados] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function carregarDashboard() {
      try {
        const response = await api.get("/dashboard");
        setDados(response.data);
      } catch (error) {
        console.error("Erro ao carregar dashboard", error);
      }
    }

    carregarDashboard();
  }, []);

  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  return (
    <Layout>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>{hoje}</p>
      </div>

      {!dados ? (
        <p>Carregando...</p>
      ) : (
        <>
          <div className="grid-4" style={{ marginBottom: 20 }}>
            <div className="stat-card green">
              <i className="bi bi-wallet2 stat-icon" aria-hidden="true"></i>
              <div className="stat-label">Saldo Atual</div>
              <div className="stat-value">{moeda.format(dados.saldoAtual)}</div>
            </div>
            <div className="stat-card">
              <i className="bi bi-arrow-down-circle stat-icon" aria-hidden="true"></i>
              <div className="stat-label">Entradas</div>
              <div className="stat-value small">{moeda.format(dados.totalEntradas)}</div>
            </div>
            <div className="stat-card red">
              <i className="bi bi-arrow-up-circle stat-icon" aria-hidden="true"></i>
              <div className="stat-label">Saídas</div>
              <div className="stat-value small">{moeda.format(dados.totalSaidas)}</div>
            </div>
            <div className="stat-card">
              <i className="bi bi-building stat-icon" aria-hidden="true"></i>
              <div className="stat-label">Congregações</div>
              <div className="stat-value small">{dados.totalCongregacoes}</div>
            </div>
          </div>

          <div className="grid-4" style={{ marginBottom: 20 }}>
            <div className="stat-card pink">
              <i className="bi bi-people stat-icon" aria-hidden="true"></i>
              <div className="stat-label">Mulheres</div>
              <div className="stat-value small">{dados.totalMulheres}</div>
            </div>
            <div className="stat-card purple">
              <i className="bi bi-bag-heart stat-icon" aria-hidden="true"></i>
              <div className="stat-label">Uniforme Festividade</div>
              <div className="stat-value small">{moeda.format(dados.totalUniformeFestividade)}</div>
            </div>
            <div className="stat-card purple">
              <i className="bi bi-music-note-beamed stat-icon" aria-hidden="true"></i>
              <div className="stat-label">Uniforme Pandeiro</div>
              <div className="stat-value small">{moeda.format(dados.totalUniformePandeiro)}</div>
            </div>
            <div className="stat-card orange">
              <i className="bi bi-cash-stack stat-icon" aria-hidden="true"></i>
              <div className="stat-label">Movimentação</div>
              <div className="stat-value small">{moeda.format(dados.totalEntradas + dados.totalSaidas)}</div>
            </div>
          </div>

          <div className="grid-2" style={{ marginTop: 8 }}>
            <div className="card">
              <div className="card-title">Últimas Movimentações</div>
              <div className="empty-state" style={{ padding: "24px 12px" }}>
                <div className="icon"><i className="bi bi-cash-coin" aria-hidden="true"></i></div>
                <p>Acompanhe os lançamentos pelo controle de caixa.</p>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Ações Rápidas</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                <a href="/novo-movimento" className="btn btn-primary">
                  <i className="bi bi-cash-coin" aria-hidden="true"></i> Nova Entrada/Saída
                </a>
                <a href="/novo-uniforme-festividade" className="btn btn-outline">
                  <i className="bi bi-bag-heart" aria-hidden="true"></i> Registrar Pagamento Uniforme
                </a>
                <a href="/nova-venda" className="btn btn-outline">
                  <i className="bi bi-cart3" aria-hidden="true"></i> Lançar Venda
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
