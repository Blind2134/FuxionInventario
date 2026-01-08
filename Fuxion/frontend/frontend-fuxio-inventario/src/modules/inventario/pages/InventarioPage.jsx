import { useState } from "react";
import { Link } from "react-router-dom";
import { FiPackage, FiPlus, FiUsers, FiAlertTriangle } from "react-icons/fi";
import { useInventario } from "../hooks/useInventario";
import { useSocios } from "../../usuarios/hooks/useSocios";
import { useAbrirSobre } from "../hooks/useAbrirSobre";
import InventarioTable from "../components/InventarioTable";
import AbrirSobreModal from "../components/AbrirSobreModal";

const InventarioPage = () => {
  const { inventario, loading: loadingInventario, refetch } = useInventario();
  console.log("Data de inventario:", inventario);
  const { socios, loading: loadingSocios } = useSocios();
  const { abrirSobre, loading: loadingAbrir } = useAbrirSobre();

  const [selectedSocio, setSelectedSocio] = useState("");
  const [productoParaAbrir, setProductoParaAbrir] = useState(null);

  // Filtrar inventario por socio
  const inventarioFiltrado = selectedSocio
    ? inventario.filter(
        (item) => item.dueno?.idUsuario === parseInt(selectedSocio)
      )
    : inventario;

  // Agrupar inventario por socio
  const inventarioPorSocio = inventario.reduce((acc, item) => {
    if (!item.dueno) return acc;

    const idSocio = item.dueno.idUsuario;

    const socio = socios.find((s) => s.idUsuario === idSocio);
    if (!socio) return acc;

    if (!acc[idSocio]) {
      acc[idSocio] = {
        socio,
        productos: [],
        totalSobres: 0,
        totalSticks: 0,
      };
    }

    acc[idSocio].productos.push({
      ...item,
      idProducto: item.producto.idProducto,
      nombreProducto: item.producto.nombre,
      sticksPorSobre: item.producto.sticksPorSobre,
    });

    acc[idSocio].totalSobres += item.cantidadSobres;
    acc[idSocio].totalSticks += item.cantidadSticks;

    return acc;
  }, {});

  // Detectar productos con stock bajo
  const productosStockBajo = inventario.filter((item) => item.stockBajo).length;

  // Confirmar abrir sobre
  const handleConfirmarAbrir = async (data) => {
    const result = await abrirSobre(data);
    if (result) {
      setProductoParaAbrir(null);
      refetch();
    }
  };

  if (loadingInventario || loadingSocios) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FiPackage className="text-blue-600" />
            Inventario General
          </h1>
          <p className="text-gray-600 mt-1">Control de stock por socio</p>
        </div>
        <Link to="/inventario/registrar-entrada" className="btn btn-primary">
          <FiPlus className="inline mr-2" />
          Registrar Entrada
        </Link>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <FiUsers className="text-white" size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {Object.keys(inventarioPorSocio).length}
              </div>
              <div className="text-sm text-gray-600">Socios con Stock</div>
            </div>
          </div>
        </div>

        <div className="card bg-green-50 border-green-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <FiPackage className="text-white" size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {inventario.reduce((sum, item) => sum + item.cantidadSobres, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Sobres</div>
            </div>
          </div>
        </div>

        <div className="card bg-red-50 border-red-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <FiAlertTriangle className="text-white" size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">
                {productosStockBajo}
              </div>
              <div className="text-sm text-gray-600">Productos Stock Bajo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtro por socio */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <label className="text-sm font-medium text-gray-700 flex-shrink-0">
            Filtrar por Socio:
          </label>
          <select
            value={selectedSocio}
            onChange={(e) => setSelectedSocio(e.target.value)}
            className="input flex-1"
          >
            <option value="">Todos los socios</option>
            {Object.values(inventarioPorSocio).map(({ socio }) => (
              <option key={socio.idUsuario} value={socio.idUsuario}>
                {socio.nombre}
              </option>
            ))}
          </select>
          {selectedSocio && (
            <Link
              to={`/inventario/socio/${selectedSocio}`}
              className="btn btn-secondary text-sm"
            >
              Ver Detalle Completo
            </Link>
          )}
        </div>
      </div>

      {/* Inventario por socio */}
      {selectedSocio ? (
        // Vista filtrada por socio
        <InventarioTable
          inventario={inventarioFiltrado}
          onAbrirSobre={(producto) =>
            setProductoParaAbrir({
              ...producto,
              idUsuario: parseInt(selectedSocio),
            })
          }
        />
      ) : (
        // Vista agrupada por socio
        <div className="space-y-6">
          {Object.values(inventarioPorSocio).map(
            ({ socio, productos, totalSobres, totalSticks }) => (
              <div key={socio.idUsuario} className="card">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {socio.nombre.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {socio.nombre}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {productos.length} productos • {totalSobres} sobres •{" "}
                        {totalSticks} sticks
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/inventario/socio/${socio.idUsuario}`}
                    className="btn btn-secondary text-sm"
                  >
                    Ver Detalle
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {productos.slice(0, 4).map((prod) => (
                    <div
                      key={prod.idProducto}
                      className={`p-3 rounded-lg ${
                        prod.stockBajo
                          ? "bg-red-50 border border-red-200"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="text-xs text-gray-600 truncate">
                        {prod.nombreProducto}
                      </div>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-lg font-bold text-blue-600">
                          {prod.cantidadSobres}
                        </span>
                        <span className="text-xs text-gray-500">sobres</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-green-600">
                          {prod.cantidadSticks}
                        </span>
                        <span className="text-xs text-gray-500">sticks</span>
                      </div>
                    </div>
                  ))}
                  {productos.length > 4 && (
                    <div className="p-3 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm text-gray-600">
                        +{productos.length - 4} más
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Modal abrir sobre */}
      {productoParaAbrir && (
        <AbrirSobreModal
          producto={productoParaAbrir}
          usuario={{ idUsuario: productoParaAbrir.idUsuario }}
          onClose={() => setProductoParaAbrir(null)}
          onConfirm={handleConfirmarAbrir}
          loading={loadingAbrir}
        />
      )}
    </div>
  );
};

export default InventarioPage;
