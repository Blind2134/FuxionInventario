// Ubicación: src/modules/productos/components/ProductoCard.jsx

import { FiEdit2, FiTrash2, FiEye, FiBox } from "react-icons/fi";
import { Link } from "react-router-dom";

const ProductoCard = ({
  producto,
  onDelete,
  onViewDetails,
  viewMode = "grid",
}) => {
  // ============================================
  // VISTA LISTA (Horizontal - Estilo Steam/Admin)
  // ============================================
  if (viewMode === "list") {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden mb-2">
        {/* Contenedor Flex Horizontal */}
        <div className="flex flex-row h-28">
          {/* 1. IMAGEN (Izquierda) */}
          <div className="w-48 flex-shrink-0 bg-gray-100 relative">
            {producto.imgUrl ? (
              <img
                src={producto.imgUrl}
                alt={producto.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <FiBox size={32} />
              </div>
            )}
          </div>

          {/* 2. INFORMACIÓN (Centro) */}
          <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-800 truncate mb-1">
                  {producto.nombre}
                </h3>
                {/* Etiquetas */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium border border-gray-200">
                    {producto.sku || "S/N"}
                  </span>
                  {producto.categoria && (
                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">
                      {producto.categoria}
                    </span>
                  )}
                  <span className="text-gray-400">•</span>
                  <span>{producto.sticksPorSobre} sticks/sobre</span>
                </div>
              </div>
            </div>

            {/* --- CAMBIOS AQUÍ: BOTONES CON BORDES --- */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => onViewDetails(producto)}
                className="text-xs flex items-center gap-1 px-3 py-1.5 rounded border border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium shadow-sm"
              >
                <FiEye size={14} /> Detalles
              </button>
              <Link
                to={`/productos/editar/${producto.idProducto}`}
                className="text-xs flex items-center gap-1 px-3 py-1.5 rounded border border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium shadow-sm"
              >
                <FiEdit2 size={14} /> Editar
              </Link>
              <button
                onClick={() => onDelete(producto.idProducto)}
                className="text-xs flex items-center gap-1 px-3 py-1.5 rounded border border-gray-300 bg-white text-gray-700 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 font-medium shadow-sm"
              >
                <FiTrash2 size={14} /> Eliminar
              </button>
            </div>
            {/* ---------------------------------------- */}
          </div>

          {/* 3. PRECIO (Derecha) */}
          <div className="w-32 bg-gray-50 border-l border-gray-100 flex flex-col items-center justify-center flex-shrink-0 px-2">
            <span className="text-xs text-gray-400 mb-1">Precio Ref.</span>
            <div className="text-xl font-bold text-green-600">
              S/ {parseFloat(producto.precioReferencial).toFixed(2)}
            </div>
            <div
              className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                producto.activo
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {producto.activo ? "ACTIVO" : "INACTIVO"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // VISTA GRID (Vertical)
  // ============================================
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 p-4">
      <div className="h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
        {producto.imgUrl ? (
          <img
            src={producto.imgUrl}
            alt={producto.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <FiBox size={48} />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-gray-900 truncate">
          {producto.nombre}
        </h3>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{producto.categoria || "General"}</span>
          <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-xs">
            {producto.sku}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-gray-500 text-sm">Precio:</span>
          <span className="text-lg font-bold text-green-600">
            S/ {parseFloat(producto.precioReferencial).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onViewDetails(producto)}
          className="flex-1 p-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-md text-sm transition-colors"
        >
          <FiEye className="mx-auto" />
        </button>
        <Link
          to={`/productos/editar/${producto.idProducto}`}
          className="flex-1 p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-center text-sm transition-colors"
        >
          <FiEdit2 className="mx-auto" />
        </Link>
        <button
          onClick={() => onDelete(producto.idProducto)}
          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-sm transition-colors"
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};

export default ProductoCard;
