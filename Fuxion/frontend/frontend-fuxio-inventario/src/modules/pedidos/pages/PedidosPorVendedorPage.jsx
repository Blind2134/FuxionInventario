import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiArrowRight, FiDollarSign, FiPackage } from "react-icons/fi";
import { usePedidos } from "../hooks/usePedidos";
import PedidoCard from "../components/PedidoCard";

const PedidosPorVendedorPage = () => {
  const { pedidos, loading } = usePedidos();
  const [expandedVendedor, setExpandedVendedor] = useState(null);

  // Agrupar pedidos por vendedor
  const ventasPorVendedor = useMemo(() => {
    const agrupado = pedidos.reduce((acc, pedido) => {
      const vendedorId = pedido.vendedor?.idUsuario || "desconocido";
      const vendedorNombre = pedido.vendedor?.nombre || "Vendedor Desconocido";

      if (!acc[vendedorId]) {
        acc[vendedorId] = {
          id: vendedorId,
          nombre: vendedorNombre,
          pedidos: [],
          totalVendido: 0,
          cantidadPedidos: 0,
        };
      }

      acc[vendedorId].pedidos.push(pedido);
      acc[vendedorId].totalVendido += parseFloat(pedido.montoTotalVenta || 0);
      acc[vendedorId].cantidadPedidos += 1;
      return acc;
    }, {});

    // Convertir a array y ordenar por mayor venta
    return Object.values(agrupado).sort(
      (a, b) => b.totalVendido - a.totalVendido
    );
  }, [pedidos]);

  if (loading) {
    return (
      <div className="p-10 text-center">Cargando datos de vendedores...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ventas por Socio</h1>
          <p className="text-gray-500">
            Rendimiento y pedidos agrupados por vendedor
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {ventasPorVendedor.map((grupo) => (
          <div
            key={grupo.id}
            className="card bg-white border border-gray-200 shadow-sm overflow-hidden"
          >
            {/* Cabecera del Vendedor */}
            <div
              className="p-4 bg-gray-50 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() =>
                setExpandedVendedor(
                  expandedVendedor === grupo.id ? null : grupo.id
                )
              }
            >
              <div className="flex items-center gap-4 mb-2 md:mb-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                  {grupo.nombre.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {grupo.nombre}
                  </h3>
                  <div className="text-sm text-gray-500 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <FiPackage size={14} /> {grupo.cantidadPedidos} pedidos
                    </span>
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      <FiDollarSign size={14} /> S/{" "}
                      {grupo.totalVendido.toFixed(2)} vendidos
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                {expandedVendedor === grupo.id
                  ? "Ocultar Pedidos"
                  : "Ver Pedidos"}
                <FiArrowRight
                  className={`transform transition-transform ${
                    expandedVendedor === grupo.id ? "rotate-90" : ""
                  }`}
                />
              </div>
            </div>

            {/* Lista de Pedidos (Expandible) */}
            {expandedVendedor === grupo.id && (
              <div className="p-4 bg-gray-50/50 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {grupo.pedidos.map((pedido) => (
                    <PedidoCard
                      key={pedido.idPedido}
                      pedido={pedido}
                      viewMode="list"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {ventasPorVendedor.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No hay ventas registradas aún.
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidosPorVendedorPage;
