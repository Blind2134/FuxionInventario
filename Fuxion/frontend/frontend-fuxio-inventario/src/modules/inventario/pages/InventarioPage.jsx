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
  const { socios, loading: loadingSocios } = useSocios();
  const { abrirSobre, loading: loadingAbrir } = useAbrirSobre();

  const [selectedSocio, setSelectedSocio] = useState("");
  const [productoParaAbrir, setProductoParaAbrir] = useState(null);

  // =======================================================
  // 1. SOLUCIÓN TABLA: Filtrar Y APLANAR los datos
  // =======================================================
  // Convertimos la estructura compleja (item.producto.nombre)
  // a una simple (item.nombreProducto) para que la tabla no se confunda.
  const inventarioFiltrado = selectedSocio
    ? inventario
        .filter((item) => item.dueno?.idUsuario === parseInt(selectedSocio))
        .map((item) => ({
          ...item,
          // Mapeo seguro: Si producto es null, ponemos un texto por defecto
          idProducto: item.producto?.idProducto,
          nombreProducto: item.producto?.nombre || "Producto Desconocido",
          categoria: item.producto?.categoria || "Sin Categoría",
          sticksPorSobre: item.producto?.sticksPorSobre || 0,
          sku: item.producto?.sku || "S/N",
          imgUrl: item.producto?.imgUrl,
        }))
    : []; // Si no hay socio, no usamos esta lista directamente para la tabla

  // =======================================================
  // 2. SOLUCIÓN CARDS: Agrupar con seguridad (Optional Chaining)
  // =======================================================
  const inventarioPorSocio = inventario.reduce((acc, item) => {
    // Si no tiene dueño o producto, saltamos para evitar errores
    if (!item.dueno || !item.producto) return acc;

    const idSocio = item.dueno.idUsuario;
    const socio = socios.find((s) => s.idUsuario === idSocio);

    // Si no encontramos los datos del socio, usamos los del item como respaldo
    const nombreSocio =
      socio?.nombre || item.dueno.nombre || "Socio Desconocido";

    if (!acc[idSocio]) {
      acc[idSocio] = {
        socio: socio || item.dueno, // Guardamos el objeto socio completo
        nombreSocio: nombreSocio,
        productos: [],
        totalSobres: 0,
        totalSticks: 0,
      };
    }

    acc[idSocio].productos.push({
      ...item,
      // Aplanamos igual que arriba
      idProducto: item.producto.idProducto,
      nombreProducto: item.producto.nombre,
      categoria: item.producto.categoria,
      sticksPorSobre: item.producto.sticksPorSobre,
    });

    acc[idSocio].totalSobres += item.cantidadSobres || 0;
    acc[idSocio].totalSticks += item.cantidadSticks || 0;

    return acc;
  }, {});

  const productosStockBajo = inventario.filter((item) => item.stockBajo).length;

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

      {/* Estadísticas */}
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
                {inventario.reduce(
                  (sum, item) => sum + (item.cantidadSobres || 0),
                  0
                )}
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
            {Object.values(inventarioPorSocio).map(({ socio, nombreSocio }) => (
              <option key={socio.idUsuario} value={socio.idUsuario}>
                {nombreSocio}
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

      {/* CONTENIDO PRINCIPAL */}
      {selectedSocio ? (
        // ==========================================
        // VISTA TABLA (DETALLE UN SOCIO)
        // ==========================================
        <InventarioTable
          inventario={inventarioFiltrado} // <--- Ahora pasamos la data APLANADA
          onAbrirSobre={(producto) =>
            setProductoParaAbrir({
              ...producto,
              idUsuario: parseInt(selectedSocio),
            })
          }
        />
      ) : (
        // ==========================================
        // VISTA CARDS (TODOS LOS SOCIOS)
        // ==========================================
        <div className="space-y-6">
          {Object.values(inventarioPorSocio).map(
            ({ socio, nombreSocio, productos, totalSobres, totalSticks }) => (
              <div key={socio.idUsuario} className="card">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {nombreSocio.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {nombreSocio}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {productos.length} productos •{" "}
                        <span className="font-medium text-blue-600">
                          {totalSobres} sobres
                        </span>{" "}
                        • {totalSticks} sticks
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
                      className={`p-3 rounded-lg border transition-colors ${
                        prod.stockBajo
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-100 hover:border-blue-200"
                      }`}
                    >
                      <div
                        className="text-xs font-medium text-gray-700 truncate mb-1"
                        title={prod.nombreProducto}
                      >
                        {prod.nombreProducto}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-blue-600">
                          {prod.cantidadSobres}
                        </span>
                        <span className="text-[10px] uppercase text-gray-500 tracking-wide">
                          sobres
                        </span>
                      </div>
                      {prod.cantidadSticks > 0 && (
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-sm font-bold text-green-600">
                            {prod.cantidadSticks}
                          </span>
                          <span className="text-[10px] uppercase text-gray-500 tracking-wide">
                            sticks
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  {productos.length > 4 && (
                    <div className="p-3 bg-gray-100 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
                      <span className="text-sm font-medium text-gray-500">
                        +{productos.length - 4} más...
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
