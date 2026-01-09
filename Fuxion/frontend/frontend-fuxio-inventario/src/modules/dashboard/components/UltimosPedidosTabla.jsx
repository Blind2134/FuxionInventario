import React from "react";
import { FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";

const UltimosPedidosTabla = ({ data }) => {
  const getEstadoBadge = (estado) => {
    const classes = {
      PENDIENTE: "bg-yellow-100 text-yellow-800",
      PAGADO: "bg-blue-100 text-blue-800",
      ENTREGADO: "bg-green-100 text-green-800",
      CANCELADO: "bg-red-100 text-red-800",
    };
    return classes[estado] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Últimas Transacciones
        </h3>
        <Link
          to="/pedidos"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Ver todo
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3 text-center">Estado</th>
              <th className="px-4 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data &&
              data.map((pedido) => (
                <tr key={pedido.idPedido} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-gray-600">
                    {pedido.codigoPedido}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {pedido.clienteNombre}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(pedido.fechaCreacion).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-800">
                    S/ {pedido.montoTotalVenta?.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${getEstadoBadge(
                        pedido.estado
                      )}`}
                    >
                      {pedido.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/pedidos/detalle/${pedido.idPedido}`}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <FiEye size={18} className="inline" />
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UltimosPedidosTabla;
