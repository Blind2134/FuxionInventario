import { useState } from "react";
import { FiX, FiPackage, FiArrowRight } from "react-icons/fi";

const AbrirSobreModal = ({ producto, socio, onClose, onConfirm, loading }) => {
  const [cantidad, setCantidad] = useState(1);

  if (!producto) return null;

  const sticksGenerados = cantidad * producto.sticksPorSobre;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      idSocio: socio.idSocio,
      idProducto: producto.idProducto,
      idAlmacen: 1, // Por defecto
      cantidadSobres: cantidad,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-blue-50 px-6 py-4 flex items-center justify-between border-b border-blue-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiPackage className="text-blue-600" />
            Abrir Sobre
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Contenido */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Info del producto */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Producto:</div>
            <div className="text-lg font-bold text-gray-900">
              {producto.nombreProducto}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Disponibles:{" "}
              <span className="font-semibold">
                {producto.cantidadSobres} sobres
              </span>
            </div>
          </div>

          {/* Cantidad a abrir */}
          <div>
            <label className="label">¿Cuántos sobres deseas abrir?</label>
            <input
              type="number"
              min="1"
              max={producto.cantidadSobres}
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
              className="input"
              required
            />
          </div>

          {/* Cálculo visual */}
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
            <div className="flex items-center justify-between text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {cantidad}
                </div>
                <div className="text-gray-600">Sobres</div>
              </div>
              <FiArrowRight className="text-blue-600" size={24} />
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {sticksGenerados}
                </div>
                <div className="text-gray-600">Sticks</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-center text-gray-500">
              {cantidad} sobre(s) × {producto.sticksPorSobre} sticks ={" "}
              {sticksGenerados} sticks
            </div>
          </div>

          {/* Advertencia */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              ⚠️ Esta acción convertirá {cantidad} sobre(s) cerrado(s) en{" "}
              {sticksGenerados} sticks sueltos. Esta operación no se puede
              deshacer.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={loading}
            >
              {loading ? "Abriendo..." : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AbrirSobreModal;
