import React from "react";
import { usePrestamos } from "../hooks/usePrestamos";
import { PrestamoHistorialTabla } from "../components/PrestamoHistorialTabla";

export const PrestamosPage = () => {
  const {
    prestamos,
    estadisticas,
    loading,
    error,
    marcarComoPagado,
    recargar,
  } = usePrestamos();

  if (loading && prestamos.length === 0) {
    return (
      <div className="p-10 text-center animate-pulse">
        Cargando historial de préstamos...
      </div>
    );
  }

  if (error) {
    return <div className="p-10 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Encabezado */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">
            Control de Préstamos entre Socios
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Visualiza el historial de intercambio de stock y gestiona las
            devoluciones pendientes.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={recargar}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Actualizar Lista
          </button>
        </div>
      </div>

      {/* Tarjetas de Resumen (Stats) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6 border-l-4 border-red-500">
          <dt className="text-sm font-medium text-gray-500 truncate">
            Préstamos Pendientes
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {estadisticas.totalPendientes}
          </dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6 border-l-4 border-green-500">
          <dt className="text-sm font-medium text-gray-500 truncate">
            Préstamos Pagados/Devueltos
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {estadisticas.totalPagados}
          </dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6 border-l-4 border-blue-500">
          <dt className="text-sm font-medium text-gray-500 truncate">
            Total Histórico
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {prestamos.length}
          </dd>
        </div>
      </div>

      {/* Tabla de Datos */}
      <PrestamoHistorialTabla
        prestamos={prestamos}
        onMarcarPagado={marcarComoPagado}
      />
    </div>
  );
};

export default PrestamosPage;
