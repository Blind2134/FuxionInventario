import React from "react";
import { FiAward, FiTrendingUp } from "react-icons/fi";

const TopVendedoresCard = ({ data }) => {
  return (
    <div className="card h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FiAward className="text-yellow-500" /> Top Socios
      </h3>
      <div className="space-y-4">
        {data &&
          data.map((vendedor, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm
                ${
                  index === 0
                    ? "bg-yellow-100 text-yellow-700"
                    : index === 1
                    ? "bg-gray-200 text-gray-700"
                    : index === 2
                    ? "bg-orange-100 text-orange-800"
                    : "bg-blue-50 text-blue-600"
                }
              `}
                >
                  {index + 1}
                </div>
                <div>
                  {/* JSON usa nombreSocio */}
                  <p className="font-medium text-gray-800 text-sm">
                    {vendedor.nombreSocio}
                  </p>
                  {/* JSON usa numeroPedidos */}
                  <p className="text-xs text-gray-500">
                    {vendedor.numeroPedidos} pedidos
                  </p>
                </div>
              </div>
              <div className="text-right">
                {/* JSON usa totalVentas como monto (Double) */}
                <p className="font-bold text-gray-900 text-sm">
                  S/ {vendedor.totalVentas?.toFixed(2)}
                </p>
                <div className="flex items-center justify-end text-xs text-green-600">
                  <FiTrendingUp className="mr-1" /> Ventas
                </div>
              </div>
            </div>
          ))}
        {(!data || data.length === 0) && (
          <p className="text-center text-gray-500 text-sm py-4">
            No hay datos de ventas aún.
          </p>
        )}
      </div>
    </div>
  );
};

export default TopVendedoresCard;
