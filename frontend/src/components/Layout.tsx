import { NavLink, useNavigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="layout">
      <aside className="sidebar" role="navigation" aria-label="Menu principal">
        <div className="sidebar-brand">
          <i className="bi bi-flower1 brand-icon" aria-hidden="true"></i>
          <span className="brand-name">Tesouraria</span>
          <span className="brand-sub">UFADS - Dep. Mulheres</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">Principal</div>
          <NavLink className="nav-link" to="/dashboard">
            <i className="bi bi-speedometer2" aria-hidden="true"></i> Dashboard
          </NavLink>

          <div className="nav-section">Financeiro</div>
          <NavLink className="nav-link" to="/caixa">
            <i className="bi bi-cash-coin" aria-hidden="true"></i> Controle de Caixa
          </NavLink>
          <NavLink className="nav-link" to="/vendas">
            <i className="bi bi-cart3" aria-hidden="true"></i> Vendas
          </NavLink>
          <NavLink className="nav-link" to="/relatorios">
            <i className="bi bi-clipboard-data" aria-hidden="true"></i> Relatórios
          </NavLink>

          <NavLink className="nav-link" to="/historico">
            <i className="bi bi-clock-history" aria-hidden="true"></i> Historico
          </NavLink>

          <div className="nav-section">Uniformes</div>
          <NavLink className="nav-link" to="/uniforme-festividade">
            <i className="bi bi-bag-heart" aria-hidden="true"></i> Uniforme Festividade
          </NavLink>
          <NavLink className="nav-link" to="/uniforme-pandeiro">
            <i className="bi bi-music-note-beamed" aria-hidden="true"></i> Uniforme Pandeiro
          </NavLink>

          <div className="nav-section">Cadastros</div>
          <NavLink className="nav-link" to="/mulheres">
            <i className="bi bi-people" aria-hidden="true"></i> Mulheres
          </NavLink>
          <NavLink className="nav-link" to="/congregacoes">
            <i className="bi bi-building" aria-hidden="true"></i> Congregações
          </NavLink>
        </nav>

        <button className="nav-logout" onClick={logout} aria-label="Sair do sistema">
          <i className="bi bi-box-arrow-left" aria-hidden="true"></i> Sair
        </button>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}
