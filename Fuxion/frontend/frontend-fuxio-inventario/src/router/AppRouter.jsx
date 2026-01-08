// =========================================
// AppRouter.jsx ACTUALIZADO
// Ubicación: src/router/AppRouter.jsx
// =========================================

import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout/MainLayout";

// Páginas del módulo de productos
import ProductosPage from "../modules/productos/pages/ProductosPage";
import CrearProductoPage from "../modules/productos/pages/CrearProductoPage";
import EditarProductoPage from "../modules/productos/pages/EditarProductoPage";

// Páginas del módulo de socios (NUEVAS)
import SociosPage from "../modules/usuarios/pages/SociosPage";
import CrearSocioPage from "../modules/usuarios/pages/CrearSocioPage";
import EditarSocioPage from "../modules/usuarios/pages/EditarSocioPage";
import PerfilSocioPage from "../modules/usuarios/pages/PerfilSocioPage";

// Páginas del módulo de inventario (NUEVAS)
import InventarioPage from "../modules/inventario/pages/InventarioPage";
import RegistrarEntradaPage from "../modules/inventario/pages/RegistrarEntradaPage";
import InventarioSocioPage from "../modules/inventario/pages/InventarioSocioPage";

// Páginas temporales
const DashboardPage = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-700">Total Productos</h3>
        <p className="text-3xl font-bold text-blue-600 mt-2">156</p>
      </div>
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-700">Pedidos Hoy</h3>
        <p className="text-3xl font-bold text-green-600 mt-2">23</p>
      </div>
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-700">Stock Bajo</h3>
        <p className="text-3xl font-bold text-red-600 mt-2">8</p>
      </div>
    </div>
  </div>
);

const PedidosPage = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900">🚚 Pedidos</h1>
    <p className="text-gray-600 mt-2">Gestión de pedidos (Próximamente)</p>
  </div>
);

const ReportesPage = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900">📈 Reportes</h1>
    <p className="text-gray-600 mt-2">Análisis y estadísticas (Próximamente)</p>
  </div>
);

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Dashboard */}
          <Route path="/" element={<DashboardPage />} />

          {/* Módulo de Productos */}
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/productos/crear" element={<CrearProductoPage />} />
          <Route
            path="/productos/editar/:id"
            element={<EditarProductoPage />}
          />

          {/* Módulo de Socios - NUEVO */}
          <Route path="/usuarios" element={<SociosPage />} />
          <Route path="/usuarios/crear" element={<CrearSocioPage />} />
          <Route path="/usuarios/editar/:id" element={<EditarSocioPage />} />
          <Route path="/usuarios/perfil/:id" element={<PerfilSocioPage />} />

          {/* Módulo de Inventario - COMPLETO */}
          <Route path="/inventario" element={<InventarioPage />} />
          <Route
            path="/inventario/registrar-entrada"
            element={<RegistrarEntradaPage />}
          />
          <Route
            path="/inventario/socio/:id"
            element={<InventarioSocioPage />}
          />
          {/* Otros módulos (temporales) */}
          <Route path="/pedidos" element={<PedidosPage />} />
          <Route path="/reportes" element={<ReportesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
