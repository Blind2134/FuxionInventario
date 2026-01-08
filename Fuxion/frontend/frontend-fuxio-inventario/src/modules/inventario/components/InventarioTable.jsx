import { FiPackage, FiAlertTriangle } from "react-icons/fi";

const InventarioTable = ({ inventario, onAbrirSobre }) => {
  if (!inventario || inventario.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <p className="text-gray-600">No hay productos en inventario</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sobres
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sticks
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sticks/Sobre
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventario.map((item, index) => (
              <tr
                key={
                  item.idInventario ||
                  `${item.idProducto}-${item.idSocio}-${index}`
                }
                className={`hover:bg-gray-50 ${
                  item.stockBajo ? "bg-red-50" : ""
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {item.stockBajo && (
                      <FiAlertTriangle className="text-red-500" size={16} />
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {item.nombreProducto}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                    {item.categoria || "Sin categoría"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-lg font-bold text-gray-900">
                    {item.cantidadSobres}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-lg font-bold text-green-600">
                    {item.cantidadSticks}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  {item.sticksPorSobre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {item.cantidadSobres > 0 && (
                    <button
                      onClick={() => onAbrirSobre(item)}
                      className="btn btn-secondary text-xs"
                      title="Abrir sobre para vender sticks"
                    >
                      <FiPackage className="inline mr-1" size={14} />
                      Abrir Sobre
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {inventario.reduce((sum, item) => sum + item.cantidadSobres, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Sobres</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {inventario.reduce((sum, item) => sum + item.cantidadSticks, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Sticks</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventarioTable;
