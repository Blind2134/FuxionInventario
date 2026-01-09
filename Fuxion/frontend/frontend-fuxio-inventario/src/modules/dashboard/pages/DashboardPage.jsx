import React from "react";
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiBox,
  FiActivity,
} from "react-icons/fi";
import { useDashboardData } from "../hooks/useDashboardData";

// Componentes
import KPICard from "../components/KPICard";
import VentasChart from "../components/VentasChart";
import TopProductosChart from "../components/TopProductosChart";
import PedidosPorEstadoChart from "../components/PedidosPorEstadoChart";
import StockCriticoTabla from "../components/StockCriticoTabla";
import TopVendedoresCard from "../components/TopVendedoresCard";
import UltimosPedidosTabla from "../components/UltimosPedidosTabla";
import AlertasPanel from "../components/AlertasPanel";

const DashboardPage = () => {
  const { data, loading, error } = useDashboardData();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );

  if (error)
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="space-y-6 pb-10">
      {/* Título */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard General
          </h1>
          <p className="text-gray-500">Resumen de actividad en tiempo real</p>
        </div>
        <div className="text-sm bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          📅 {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Alertas */}
      <AlertasPanel
        stockBajoCount={data.kpis?.stockBajo || 0}
        prestamosPendientes={data.kpis?.prestamosPendientes || 0}
      />

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Ventas del Mes"
          value={`S/ ${data.kpis?.ventasMes?.toFixed(2) || "0.00"}`}
          icon={FiDollarSign}
          color="green"
          subtitle={`Ventas hoy: S/ ${data.kpis?.ventasHoy?.toFixed(2)}`}
        />
        <KPICard
          title="Pedidos Hoy"
          value={data.kpis?.pedidosHoy || 0}
          icon={FiShoppingBag}
          color="blue"
          subtitle="Nuevos pedidos"
        />
        <KPICard
          title="Socios Activos"
          value={data.kpis?.sociosActivos || 0}
          icon={FiUsers}
          color="purple"
          subtitle="En el sistema"
        />
        <KPICard
          title="Productos Totales"
          value={data.kpis?.totalProductos || 0}
          icon={FiBox}
          color="indigo"
          subtitle={`${data.kpis?.stockBajo} con stock bajo`}
        />
      </div>

      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Pasamos ventasUltimos7Dias que viene en tu JSON */}
          <VentasChart data={data.ventasUltimos7Dias} />
        </div>
        <div className="lg:col-span-1">
          <PedidosPorEstadoChart data={data.pedidosPorEstado} />
        </div>
      </div>

      {/* Tablas de Detalles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TopProductosChart data={data.topProductos} />
        </div>
        <div className="lg:col-span-1">
          <TopVendedoresCard data={data.topVendedores} />
        </div>
        <div className="lg:col-span-1">
          <StockCriticoTabla data={data.stockCritico} />
        </div>
      </div>

      {/* Últimos Pedidos */}
      <div className="w-full">
        <UltimosPedidosTabla data={data.ultimosPedidos} />
      </div>
    </div>
  );
};

export default DashboardPage;
