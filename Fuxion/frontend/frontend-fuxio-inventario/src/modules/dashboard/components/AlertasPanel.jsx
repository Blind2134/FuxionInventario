import React from "react";
import { FiBell, FiInfo, FiAlertCircle } from "react-icons/fi";

const AlertasPanel = ({ stockBajoCount = 0, prestamosPendientes = 0 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {stockBajoCount > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm flex items-start">
          <FiAlertCircle
            className="text-red-500 mt-1 mr-3 flex-shrink-0"
            size={20}
          />
          <div>
            <h4 className="font-bold text-red-700 text-sm">Stock Bajo</h4>
            <p className="text-sm text-red-600 mt-1">
              Hay {stockBajoCount} productos con niveles críticos de inventario.
            </p>
          </div>
        </div>
      )}

      {prestamosPendientes > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r shadow-sm flex items-start">
          <FiBell
            className="text-yellow-600 mt-1 mr-3 flex-shrink-0"
            size={20}
          />
          <div>
            <h4 className="font-bold text-yellow-700 text-sm">
              Préstamos Pendientes
            </h4>
            <p className="text-sm text-yellow-600 mt-1">
              Tienes {prestamosPendientes} préstamos que deben ser devueltos.
            </p>
          </div>
        </div>
      )}

      {stockBajoCount === 0 && prestamosPendientes === 0 && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r shadow-sm flex items-start md:col-span-2">
          <FiInfo
            className="text-green-500 mt-1 mr-3 flex-shrink-0"
            size={20}
          />
          <div>
            <h4 className="font-bold text-green-700 text-sm">Todo en orden</h4>
            <p className="text-sm text-green-600 mt-1">
              No hay alertas críticas en este momento.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertasPanel;
