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

// Páginas del módulo de pedidos (NUEVAS)
import NuevoPedidoPage from "../modules/pedidos/pages/NuevoPedidoPage";
import DetallePedidoPage from "../modules/pedidos/pages/DetallePedidoPage";
import PedidosPage from "../modules/pedidos/pages/PedidosPage";
import PedidosPorVendedorPage from "../modules/pedidos/pages/PedidosPorVendedorPage";
import PedidosPorEstadoPage from "../modules/pedidos/pages/PedidosPorEstadoPage";

import PrestamosPage from "../modules/prestamos/pages/PrestamosPage";

import DashboardPage from "../modules/dashboard/pages/DashboardPage";

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

          {/* Rutas de Pedidos */}
          <Route path="pedidos" element={<PedidosPage />} />
          <Route path="pedidos/nuevo" element={<NuevoPedidoPage />} />
          <Route
            path="pedidos/detalle/:idPedido"
            element={<DetallePedidoPage />}
          />

          {/* --- NUEVAS RUTAS --- */}
          <Route
            path="pedidos/por-vendedor"
            element={<PedidosPorVendedorPage />}
          />
          <Route path="pedidos/tablero" element={<PedidosPorEstadoPage />} />

          {/* --- AGREGAR ESTO: Nueva Ruta de Préstamos --- */}
          <Route path="/prestamos" element={<PrestamosPage />} />

          {/* Otros módulos (temporales) */}
          <Route path="/reportes" element={<ReportesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
