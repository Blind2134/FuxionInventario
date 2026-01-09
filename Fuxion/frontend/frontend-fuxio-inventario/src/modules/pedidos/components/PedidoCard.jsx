import { FiEye, FiCheck, FiPackage, FiTruck, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";

const PedidoCard = ({ pedido, onConfirmarEntrega, viewMode = "grid" }) => {
  // Color según estado
  const getEstadoColor = (estado) => {
    const colors = {
      PENDIENTE: "bg-yellow-100 text-yellow-700 border-yellow-300",
      EMPAQUETADO: "bg-blue-100 text-blue-700 border-blue-300",
      ENTREGADO_MOTORIZADO: "bg-green-100 text-green-700 border-green-300",
      CANCELADO: "bg-red-100 text-red-700 border-red-300",
    };
    return colors[estado] || "bg-gray-100 text-gray-700";
  };

  // Formato de fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ============================================
  // VISTA LISTA (Compacta)
  // ============================================
  if (viewMode === "list") {
    return (
      <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-3 p-3">
          {/* Código pedido */}
          <div className="flex-shrink-0 w-32">
            <div className="font-mono text-sm font-bold text-gray-900">
              {pedido.codigoPedido}
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(pedido.fechaCreacion)}
            </div>
          </div>

          {/* Cliente */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <FiUser className="text-gray-400" size={14} />
              <span className="text-sm font-medium text-gray-900 truncate">
                {pedido.clienteNombre}
              </span>
            </div>
            <div className="text-xs text-gray-500 truncate">
              {pedido.clienteTelefono}
            </div>
          </div>

          {/* Vendedor */}
          <div className="hidden md:block flex-shrink-0 w-40">
            <div className="text-xs text-gray-500">Vendedor:</div>
            <div className="text-sm font-medium text-gray-900 truncate">
              {pedido.vendedor?.nombre || "N/A"}
            </div>
          </div>

          {/* Estado */}
          <div className="flex-shrink-0 w-40">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(
                pedido.estado
              )}`}
            >
              {pedido.estado}
            </span>
          </div>

          {/* Monto */}
          <div className="flex-shrink-0 w-28 text-right">
            <div className="text-lg font-bold text-green-600">
              S/ {parseFloat(pedido.montoTotalVenta || 0).toFixed(2)}
            </div>
            {pedido.comisionAlmacenero && (
              <div className="text-xs text-gray-500">
                Com: S/ {parseFloat(pedido.comisionAlmacenero).toFixed(2)}
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="flex gap-1 flex-shrink-0 border-l border-gray-200 pl-2">
            <Link
              to={`/pedidos/detalle/${pedido.idPedido}`}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Ver detalle"
            >
              <FiEye size={16} />
            </Link>
            {pedido.estado === "EMPAQUETADO" && (
              <button
                onClick={() => onConfirmarEntrega(pedido.idPedido)}
                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                title="Confirmar entrega"
              >
                <FiCheck size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // VISTA GRID (Tarjetas)
  // ============================================
  return (
    <div className="card hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="font-mono text-sm font-bold text-gray-900">
          {pedido.codigoPedido}
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(
            pedido.estado
          )}`}
        >
          {pedido.estado}
        </span>
      </div>

      {/* Info cliente */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-2">
          <FiUser className="text-gray-400 mt-1" size={16} />
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">
              {pedido.clienteNombre}
            </div>
            <div className="text-xs text-gray-500">
              {pedido.clienteTelefono}
            </div>
            {pedido.clienteDireccion && (
              <div className="text-xs text-gray-500 truncate">
                {pedido.clienteDireccion}
              </div>
            )}
          </div>
        </div>

        {pedido.nombreMotorizado && (
          <div className="flex items-center gap-2">
            <FiTruck className="text-gray-400" size={16} />
            <span className="text-xs text-gray-600">
              Motorizado: {pedido.nombreMotorizado}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <FiPackage className="text-gray-400" size={16} />
          <span className="text-xs text-gray-600">
            Vendedor: {pedido.vendedor?.nombre || "N/A"}
          </span>
        </div>
      </div>

      {/* Monto */}
      <div className="pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total:</span>
          <span className="text-xl font-bold text-green-600">
            S/ {parseFloat(pedido.montoTotalVenta || 0).toFixed(2)}
          </span>
        </div>
        {pedido.comisionAlmacenero && (
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500">Comisión:</span>
            <span className="text-sm font-semibold text-blue-600">
              S/ {parseFloat(pedido.comisionAlmacenero).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Fecha */}
      <div className="text-xs text-gray-500 mt-3">
        {formatDate(pedido.fechaCreacion)}
      </div>

      {/* Acciones */}
      <div className="mt-4 flex gap-2">
        <Link
          to={`/pedidos/detalle/${pedido.idPedido}`}
          className="flex-1 btn bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm py-2 text-center"
        >
          <FiEye className="inline mr-1" size={14} /> Ver Detalle
        </Link>
        {pedido.estado === "EMPAQUETADO" && (
          <button
            onClick={() => onConfirmarEntrega(pedido.idPedido)}
            className="btn bg-green-100 text-green-700 hover:bg-green-200 text-sm py-2 px-3"
            title="Confirmar entrega"
          >
            <FiCheck size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default PedidoCard;
