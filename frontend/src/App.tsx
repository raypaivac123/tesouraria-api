import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Caixa from "./pages/Caixa";
import Vendas from "./pages/Vendas";
import Congregacoes from "./pages/Congregacoes";
import NovoMovimento from "./pages/NovoMovimento";
import NovaCongregacao from "./pages/NovaCongregacao";
import NovaVenda from "./pages/NovaVenda";
import Mulheres from "./pages/Mulheres";
import NovaMulher from "./pages/NovaMulher";
import UniformeFestividade from "./pages/UniformeFestividade";
import NovoUniformeFestividade from "./pages/NovoUniformeFestividade";
import UniformePandeiro from "./pages/UniformePandeiro";
import NovoUniformePandeiro from "./pages/NovoUniformePandeiro";
import Relatorios from "./pages/Relatorios";
import Historico from "./pages/Historico";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/caixa"
          element={
            <PrivateRoute>
              <Caixa />
            </PrivateRoute>
          }
        />

        <Route
          path="/vendas"
          element={
            <PrivateRoute>
              <Vendas />
            </PrivateRoute>
          }
        />

        <Route
          path="/congregacoes"
          element={
            <PrivateRoute>
              <Congregacoes />
            </PrivateRoute>
          }
        />

        <Route
          path="/novo-movimento"
          element={
            <PrivateRoute>
              <NovoMovimento />
            </PrivateRoute>
          }
        />

        <Route
          path="/nova-congregacao"
          element={
            <PrivateRoute>
              <NovaCongregacao />
            </PrivateRoute>
          }
        />

        <Route
          path="/nova-venda"
          element={
            <PrivateRoute>
              <NovaVenda />
            </PrivateRoute>
          }
        />

        <Route
          path="/mulheres"
          element={
            <PrivateRoute>
              <Mulheres />
            </PrivateRoute>
          }
        />

        <Route
          path="/nova-mulher"
          element={
            <PrivateRoute>
              <NovaMulher />
            </PrivateRoute>
          }
        />

        <Route
          path="/uniforme-festividade"
          element={
            <PrivateRoute>
              <UniformeFestividade />
            </PrivateRoute>
          }
        />

        <Route
          path="/novo-uniforme-festividade"
          element={
            <PrivateRoute>
              <NovoUniformeFestividade />
            </PrivateRoute>
          }
        />

        <Route
          path="/uniforme-pandeiro"
          element={
            <PrivateRoute>
              <UniformePandeiro />
            </PrivateRoute>
          }
        />

        <Route
          path="/novo-uniforme-pandeiro"
          element={
            <PrivateRoute>
              <NovoUniformePandeiro />
            </PrivateRoute>
          }
        />

        <Route
          path="/relatorios"
          element={
            <PrivateRoute>
              <Relatorios />
            </PrivateRoute>
          }
        />

        <Route
          path="/historico"
          element={
            <PrivateRoute>
              <Historico />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
