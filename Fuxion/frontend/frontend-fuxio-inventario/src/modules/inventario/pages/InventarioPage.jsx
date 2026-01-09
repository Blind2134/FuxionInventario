import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiPackage,
  FiPlus,
  FiUsers,
  FiAlertTriangle,
  FiSearch,
  FiX,
} from "react-icons/fi";
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

  // ESTADO PARA EL BUSCADOR
  const [searchTerm, setSearchTerm] = useState("");

  // =======================================================
  // 1. FILTRO MAESTRO (Buscador Global)
  // =======================================================
  // Primero filtramos toda la data cruda según lo que escriba el usuario.
  const inventarioFiltradoPorTexto = inventario.filter((item) => {
    if (!searchTerm) return true; // Si no hay búsqueda, pasa todo
    const termino = searchTerm.toLowerCase();

    // Buscamos coincidencia en Nombre del Producto O Nombre del Socio
    return (
      item.producto?.nombre?.toLowerCase().includes(termino) ||
      item.dueno?.nombre?.toLowerCase().includes(termino)
    );
  });

  // =======================================================
  // 2. SOLUCIÓN TABLA: Filtrar Y APLANAR los datos
  // =======================================================
  // Usamos 'inventarioFiltradoPorTexto' en lugar de 'inventario' directo
  const inventarioFiltrado = selectedSocio
    ? inventarioFiltradoPorTexto
        .filter((item) => item.dueno?.idUsuario === parseInt(selectedSocio))
        .map((item) => ({
          ...item,
          idProducto: item.producto?.idProducto,
          nombreProducto: item.producto?.nombre || "Producto Desconocido",
          categoria: item.producto?.categoria || "Sin Categoría",
          sticksPorSobre: item.producto?.sticksPorSobre || 0,
          sku: item.producto?.sku || "S/N",
          imgUrl: item.producto?.imgUrl,
        }))
    : [];

  // =======================================================
  // 3. SOLUCIÓN CARDS: Agrupar con seguridad
  // =======================================================
  // También usamos 'inventarioFiltradoPorTexto' aquí para que las cards
  // desaparezcan si no coinciden con la búsqueda.
  const inventarioPorSocio = inventarioFiltradoPorTexto.reduce((acc, item) => {
    if (!item.dueno || !item.producto) return acc;

    const idSocio = item.dueno.idUsuario;
    const socio = socios.find((s) => s.idUsuario === idSocio);
    const nombreSocio =
      socio?.nombre || item.dueno.nombre || "Socio Desconocido";

    if (!acc[idSocio]) {
      acc[idSocio] = {
        socio: socio || item.dueno,
        nombreSocio: nombreSocio,
        productos: [],
        totalSobres: 0,
        totalSticks: 0,
      };
    }

    acc[idSocio].productos.push({
      ...item,
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
      {/* Header con Buscador */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FiPackage className="text-blue-600" />
            Inventario General
          </h1>
          <p className="text-gray-600 mt-1">Control de stock por socio</p>
        </div>

        {/* INPUT DE BUSCADOR */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 group-focus-within:text-blue-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="Buscar producto (ej. NoCarb) o socio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <FiX />
              </button>
            )}
          </div>
        </div>

        <Link
          to="/inventario/registrar-entrada"
          className="btn btn-primary flex-shrink-0"
        >
          <FiPlus className="inline mr-2" />
          Registrar Entrada
        </Link>
      </div>

      {/* Estadísticas (Calculadas sobre el total real, no el filtrado, para mantener referencia) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <FiUsers className="text-white" size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {/* Mostramos total de socios REALES con stock, independientemente del filtro */}
                {new Set(inventario.map((i) => i.dueno?.idUsuario)).size}
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

      {/* Filtro por socio (Dropdown) */}
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
            {/* Aquí usamos la lista completa de socios para no romper el select al buscar */}
            {socios.map((socio) => (
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

      {/* MENSAJE SIN RESULTADOS */}
      {searchTerm && Object.keys(inventarioPorSocio).length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-gray-500">
            No se encontró ningún producto ni socio con:{" "}
            <span className="font-bold text-gray-700">"{searchTerm}"</span>
          </p>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      {selectedSocio ? (
        // ==========================================
        // VISTA TABLA (DETALLE UN SOCIO)
        // ==========================================
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
        // ==========================================
        // VISTA CARDS (TODOS LOS SOCIOS) - AHORA FILTRABLE
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
                        {productos.length} productos coincidentes •{" "}
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
