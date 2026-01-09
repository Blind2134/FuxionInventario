import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

const StockCriticoTabla = ({ data }) => {
  return (
    <div className="card h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-red-100 rounded-lg text-red-600">
          <FiAlertTriangle />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Stock Crítico</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th className="px-3 py-2">Producto</th>
              <th className="px-3 py-2 text-center">Sobres</th>
              <th className="px-3 py-2 text-center">Sticks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data && data.length > 0 ? (
              data.map((item, index) => {
                // LÓGICA VISUAL INTELIGENTE
                // Solo nos preocupamos por los sticks si NO quedan sobres
                const alertaSticks =
                  item.totalSobres === 0 && item.totalSticks < 5;

                // Alerta de sobres solo si es 1 o 0
                const alertaSobres = item.totalSobres <= 1;

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-gray-700">
                      {item.nombreProducto}
                      <div className="text-xs text-gray-400">
                        {item.categoria}
                      </div>
                    </td>

                    {/* Columna Sobres */}
                    <td className="px-3 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          alertaSobres
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.totalSobres}
                      </span>
                    </td>

                    {/* Columna Sticks */}
                    <td className="px-3 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          alertaSticks
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {item.totalSticks}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="px-3 py-8 text-center text-gray-500 text-xs"
                >
                  <p>✅ Inventario saludable</p>
                  <p className="mt-1">No hay productos por agotarse</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockCriticoTabla;
