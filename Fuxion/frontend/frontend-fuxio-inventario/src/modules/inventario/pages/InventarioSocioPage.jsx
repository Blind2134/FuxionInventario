import { useState } from "react";
import { FiArrowLeft, FiPackage, FiClock } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { useInventario } from "../hooks/useInventario";
import { useMovimientos } from "../hooks/useMovimientos";
import { useAbrirSobre } from "../hooks/useAbrirSobre";
import { useSocios } from "../..//usuarios/hooks/useSocios";
import InventarioTable from "../components/InventarioTable";
import AbrirSobreModal from "../components/AbrirSobreModal";

const InventarioSocioPage = () => {
  const { id } = useParams();
  const { inventario, loading: loadingInv, refetch } = useInventario(id);
  const { movimientos, loading: loadingMov } = useMovimientos(id);
  const { socios } = useSocios();
  const { abrirSobre, loading: loadingAbrir } = useAbrirSobre();

  const [productoParaAbrir, setProductoParaAbrir] = useState(null);
  const [showMovimientos, setShowMovimientos] = useState(false);

  const socio = socios.find((s) => s.idUsuario === parseInt(id));

  const handleConfirmarAbrir = async (data) => {
    const result = await abrirSobre(data);
    if (result) {
      setProductoParaAbrir(null);
      refetch();
    }
  };

  if (loadingInv) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/inventario"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <FiArrowLeft className="mr-2" />
          Volver a Inventario
        </Link>

        {socio && (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {socio.nombre.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {socio.nombre}
              </h1>
              <p className="text-gray-600">Inventario detallado</p>
            </div>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-blue-50 border-blue-200">
          <div className="text-sm text-gray-600">Total Productos</div>
          <div className="text-3xl font-bold text-blue-600">
            {inventario.productos?.length || 0}
          </div>
        </div>
        <div className="card bg-green-50 border-green-200">
          <div className="text-sm text-gray-600">Total Sobres</div>
          <div className="text-3xl font-bold text-green-600">
            {inventario.totalSobres || 0}
          </div>
        </div>
        <div className="card bg-purple-50 border-purple-200">
          <div className="text-sm text-gray-600">Total Sticks</div>
          <div className="text-3xl font-bold text-purple-600">
            {inventario.totalSticks || 0}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setShowMovimientos(false)}
          className={`px-4 py-2 font-medium transition-colors ${
            !showMovimientos
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <FiPackage className="inline mr-2" />
          Inventario
        </button>
        <button
          onClick={() => setShowMovimientos(true)}
          className={`px-4 py-2 font-medium transition-colors ${
            showMovimientos
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <FiClock className="inline mr-2" />
          Historial de Movimientos
        </button>
      </div>

      {/* Contenido */}
      {!showMovimientos ? (
        <InventarioTable
          inventario={inventario.productos || []}
          onAbrirSobre={(producto) =>
            setProductoParaAbrir({
              ...producto,
              idSocio: parseInt(id),
            })
          }
        />
      ) : (
        <div className="card">
          {loadingMov ? (
            <div className="text-center py-8">Cargando movimientos...</div>
          ) : movimientos.length === 0 ? (
            <div className="text-center py-12">
              <FiClock size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No hay movimientos registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Observación
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {movimientos.map((mov) => (
                    <tr key={mov.idMovimiento} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(mov.fecha).toLocaleDateString("es-ES")}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            mov.tipo === "ENTRADA"
                              ? "bg-green-100 text-green-700"
                              : mov.tipo === "SALIDA"
                              ? "bg-red-100 text-red-700"
                              : mov.tipo === "APERTURA_SOBRE"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {mov.tipo}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {mov.nombreProducto}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`font-bold ${
                            mov.cantidad > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {mov.cantidad > 0 ? "+" : ""}
                          {mov.cantidad}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          {mov.unidadMedida === "SOBRE_CERRADO"
                            ? "sobres"
                            : "sticks"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {mov.observacion || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal abrir sobre */}
      {productoParaAbrir && (
        <AbrirSobreModal
          producto={productoParaAbrir}
          socio={{ idSocio: productoParaAbrir.idSocio }}
          onClose={() => setProductoParaAbrir(null)}
          onConfirm={handleConfirmarAbrir}
          loading={loadingAbrir}
        />
      )}
    </div>
  );
};

export default InventarioSocioPage;
