import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    try {
      const response = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch {
      setErro("Usuário ou senha inválidos.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-brand">
          <i className="bi bi-flower1 logo-icon" aria-hidden="true"></i>
          <h1>Tesouraria UFADS</h1>
          <p>Departamento de Mulheres</p>
        </div>

        <div className="login-card">
          <h2>Bem-vinda!</h2>
          {erro && <div className="alert alert-error" role="alert">{erro}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Usuário</label>
              <div className="input-with-icon">
                <i className="bi bi-person input-icon" aria-hidden="true"></i>
                <input
                  className="form-control"
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <div className="input-with-icon">
                <i className="bi bi-lock input-icon" aria-hidden="true"></i>
                <input
                  className="form-control"
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button className="btn-login" type="submit">Entrar no Sistema</button>
          </form>
        </div>

        <div className="login-footer">© 2026 UFADS - Acesso restrito à administradora</div>
      </div>
    </div>
  );
}
