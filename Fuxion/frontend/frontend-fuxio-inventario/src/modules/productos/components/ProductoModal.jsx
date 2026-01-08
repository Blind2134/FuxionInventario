import { FiX } from "react-icons/fi";
import { useEffect } from "react";
const ProductoModal = ({ producto, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Si la tecla presionada es ESC (Escape)
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Activamos la escucha del teclado
    window.addEventListener("keydown", handleKeyDown);

    // Limpiamos la escucha cuando el modal se cierra (para no gastar memoria)
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!producto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Detalle del Producto
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Imagen */}
          {producto.imgUrl && (
            <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={producto.imgUrl}
                alt={producto.nombre}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Información */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Nombre</h3>
              <p className="text-lg font-bold text-gray-900">
                {producto.nombre}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Categoría
                </h3>
                <p className="text-gray-900">{producto.categoria || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">SKU</h3>
                <p className="text-gray-900">{producto.sku || "N/A"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Sticks por Sobre
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {producto.sticksPorSobre}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Precio Referencial
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  S/ {parseFloat(producto.precioReferencial).toFixed(2)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Estado</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  producto.activo
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {producto.activo ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <button onClick={onClose} className="btn btn-secondary w-full">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductoModal;
