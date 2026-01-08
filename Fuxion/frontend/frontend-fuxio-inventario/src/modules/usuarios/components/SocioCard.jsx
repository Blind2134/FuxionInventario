import {
  FiEdit2,
  FiTrash2,
  FiEye,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const SocioCard = ({
  socio,
  onDelete,
  onViewDetails,
  onReactivar,
  viewMode = "grid",
}) => {
  // Generar iniciales para el avatar
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
      month: "2-digit",
      year: "numeric",
    });
  };

  // ============================================
  // VISTA LISTA (Compacta)
  // ============================================
  if (viewMode === "list") {
    return (
      <div
        className={`bg-white border rounded-lg hover:shadow-md transition-all duration-200 ${
          !socio.activo
            ? "opacity-60 border-gray-300"
            : "border-gray-200 hover:border-blue-300"
        }`}
      >
        <div className="flex items-center gap-3 p-2.5">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {getInitials(socio.nombre)}
          </div>

          {/* Información principal */}
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-sm font-bold text-gray-900 truncate">
              {socio.nombre}
            </h3>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
              <span className="flex items-center gap-1">
                <FiMail size={12} />
                {socio.email}
              </span>
              {socio.telefono && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FiPhone size={12} />
                    {socio.telefono}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Rol */}
          <div className="hidden md:block flex-shrink-0 w-32">
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-medium ${getRolColor(
                socio.nombreRol
              )}`}
            >
              {socio.nombreRol}
            </span>
          </div>

          {/* Fecha registro */}
          <div className="hidden lg:block flex-shrink-0 w-24 text-xs text-gray-500">
            {formatDate(socio.fechaRegistro)}
          </div>

          {/* Estado */}
          <div className="flex-shrink-0 w-20 text-center">
            {socio.activo ? (
              <span className="inline-flex items-center gap-1 text-xs text-green-600">
                <FiCheckCircle size={14} />
                Activo
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-red-600">
                <FiXCircle size={14} />
                Inactivo
              </span>
            )}
          </div>

          {/* Acciones */}
          <div className="flex gap-1 flex-shrink-0 border-l border-gray-200 pl-2">
            <button
              onClick={() => onViewDetails(socio)}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              title="Ver detalles"
            >
              <FiEye size={16} />
            </button>
            <Link
              to={`/usuarios/editar/${socio.idUsuario}`}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Editar"
            >
              <FiEdit2 size={16} />
            </Link>
            {socio.activo ? (
              <button
                onClick={() => onDelete(socio.idUsuario)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Desactivar"
              >
                <FiTrash2 size={16} />
              </button>
            ) : (
              <button
                onClick={() => onReactivar(socio.idUsuario)}
                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                title="Reactivar"
              >
                <FiCheckCircle size={16} />
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
    <div
      className={`card hover:shadow-lg transition-all duration-200 ${
        !socio.activo ? "opacity-60" : ""
      }`}
    >
      {/* Avatar grande */}
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
          {getInitials(socio.nombre)}
        </div>
      </div>

      {/* Información */}
      <div className="space-y-3 text-center">
        <h3 className="text-lg font-bold text-gray-900">{socio.nombre}</h3>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <FiMail size={14} />
            <span className="truncate">{socio.email}</span>
          </div>

          {socio.telefono && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <FiPhone size={14} />
              <span>{socio.telefono}</span>
            </div>
          )}
        </div>

        {/* Rol */}
        <div className="flex justify-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getRolColor(
              socio.nombreRol
            )}`}
          >
            {socio.nombreRol}
          </span>
        </div>

        {/* Estado */}
        <div className="pt-2 border-t border-gray-200">
          {socio.activo ? (
            <span className="inline-flex items-center gap-1 text-sm text-green-600">
              <FiCheckCircle />
              Activo
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-sm text-red-600">
              <FiXCircle />
              Inactivo
            </span>
          )}
        </div>

        <div className="text-xs text-gray-500">
          Registro: {formatDate(socio.fechaRegistro)}
        </div>
      </div>

      {/* Acciones */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onViewDetails(socio)}
          className="flex-1 btn bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm py-2"
        >
          <FiEye className="inline mr-1" size={14} /> Ver
        </button>
        <Link
          to={`/usuarios/editar/${socio.idUsuario}`}
          className="flex-1 btn bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm text-center py-2"
        >
          <FiEdit2 className="inline mr-1" size={14} /> Editar
        </Link>
        {socio.activo ? (
          <button
            onClick={() => onDelete(socio.idUsuario)}
            className="btn bg-red-100 text-red-700 hover:bg-red-200 text-sm py-2 px-3"
            title="Desactivar"
          >
            <FiTrash2 size={14} />
          </button>
        ) : (
          <button
            onClick={() => onReactivar(socio.idUsuario)}
            className="btn bg-green-100 text-green-700 hover:bg-green-200 text-sm py-2 px-3"
            title="Reactivar"
          >
            <FiCheckCircle size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SocioCard;
