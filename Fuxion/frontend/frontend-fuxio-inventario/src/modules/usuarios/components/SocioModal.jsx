import {
  FiX,
  FiMail,
  FiPhone,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

import { Link } from "react-router-dom";

const SocioModal = ({ socio, onClose }) => {
  if (!socio) return null;

  // Generar iniciales
  const getInitials = (nombre) => {
    return nombre
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Color según rol
  const getRolColor = (nombreRol) => {
    const colors = {
      VENDEDOR: "bg-blue-100 text-blue-700",
      ALMACENERO: "bg-purple-100 text-purple-700",
      ADMINISTRADOR: "bg-red-100 text-red-700",
    };
    return colors[nombreRol] || "bg-gray-100 text-gray-700";
  };

  // Formato de fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Perfil del Socio</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Avatar y nombre */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full text-white font-bold text-3xl mb-4">
              {getInitials(socio.nombre)}
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{socio.nombre}</h3>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getRolColor(
                  socio.nombreRol
                )}`}
              >
                {socio.nombreRol}
              </span>
              {socio.activo ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <FiCheckCircle size={14} />
                  Activo
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  <FiXCircle size={14} />
                  Inactivo
                </span>
              )}
            </div>
          </div>

          {/* Información de contacto */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-900 mb-3">
              Información de Contacto
            </h4>

            <div className="flex items-center gap-3 text-gray-700">
              <FiMail className="text-blue-600" size={18} />
              <div>
                <div className="text-xs text-gray-500">Email</div>
                <div className="font-medium">{socio.email}</div>
              </div>
            </div>

            {socio.telefono && (
              <div className="flex items-center gap-3 text-gray-700">
                <FiPhone className="text-green-600" size={18} />
                <div>
                  <div className="text-xs text-gray-500">Teléfono</div>
                  <div className="font-medium">{socio.telefono}</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 text-gray-700">
              <FiCalendar className="text-purple-600" size={18} />
              <div>
                <div className="text-xs text-gray-500">Fecha de Registro</div>
                <div className="font-medium">
                  {formatDate(socio.fechaRegistro)}
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas (opcional - si las tienes) */}
          {(socio.totalProductosInventario !== undefined ||
            socio.totalPedidosRealizados !== undefined) && (
            <div className="grid grid-cols-2 gap-4">
              {socio.totalProductosInventario !== undefined && (
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {socio.totalProductosInventario}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Productos en Inventario
                  </div>
                </div>
              )}

              {socio.totalPedidosRealizados !== undefined && (
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {socio.totalPedidosRealizados}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Pedidos Realizados
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Información adicional */}
          <div className="border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-500 space-y-1">
              <p>
                <strong>ID:</strong> {socio.idUsuario}
              </p>
              <p>
                <strong>ID Rol:</strong> {socio.idRol}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex gap-3">
            <button onClick={onClose} className="btn btn-secondary flex-1">
              Cerrar
            </button>
            <Link
              to={`/usuarios/perfil/${socio.idUsuario}`}
              className="btn btn-primary flex-1 text-center"
              onClick={onClose}
            >
              Ver Perfil Completo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocioModal;
