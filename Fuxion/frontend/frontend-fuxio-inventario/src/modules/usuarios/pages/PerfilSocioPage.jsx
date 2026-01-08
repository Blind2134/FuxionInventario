import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiCalendar,
  FiPackage,
  FiShoppingCart,
  FiEdit2,
} from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { sociosApi } from "../../../api/enpoints/sociosApi";
import { toast } from "react-toastify";

const PerfilSocioPage = () => {
  const { id } = useParams();
  const [socio, setSocio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocio = async () => {
      try {
        const data = await sociosApi.getById(id);
        setSocio(data);
      } catch (err) {
        toast.error("Error al cargar el socio");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSocio();
  }, [id]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!socio) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-600">No se encontró el socio</p>
        <Link to="/usuarios" className="btn btn-primary mt-4">
          Volver a Socios
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/usuarios"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <FiArrowLeft className="mr-2" />
          Volver a Socios
        </Link>
      </div>

      {/* Perfil del socio */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-4xl">
              {getInitials(socio.nombre)}
            </div>
            <Link
              to={`/usuarios/editar/${socio.idUsuario}`}
              className="btn btn-secondary mt-4 text-sm"
            >
              <FiEdit2 className="inline mr-1" size={14} />
              Editar Perfil
            </Link>
          </div>

          {/* Información */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {socio.nombre}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getRolColor(
                    socio.nombreRol
                  )}`}
                >
                  {socio.nombreRol}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    socio.activo
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {socio.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-gray-700">
                <FiMail className="text-blue-600" size={20} />
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="font-medium">{socio.email}</div>
                </div>
              </div>

              {socio.telefono && (
                <div className="flex items-center gap-3 text-gray-700">
                  <FiPhone className="text-green-600" size={20} />
                  <div>
                    <div className="text-xs text-gray-500">Teléfono</div>
                    <div className="font-medium">{socio.telefono}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 text-gray-700">
                <FiCalendar className="text-purple-600" size={20} />
                <div>
                  <div className="text-xs text-gray-500">Fecha de Registro</div>
                  <div className="font-medium">
                    {new Date(socio.fechaRegistro).toLocaleDateString("es-ES")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas (placeholder - conectar con tu backend después) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <FiPackage className="text-white" size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {socio.totalProductosInventario || 0}
              </div>
              <div className="text-sm text-gray-600">
                Productos en Inventario
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-green-50 border-green-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <FiShoppingCart className="text-white" size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {socio.totalPedidosRealizados || 0}
              </div>
              <div className="text-sm text-gray-600">Pedidos Realizados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Secciones adicionales - Inventario y Pedidos (futuro) */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Inventario del Socio
        </h2>
        <p className="text-gray-600">
          Esta sección mostrará el inventario completo del socio.
        </p>
        {/* TODO: Agregar componente de inventario */}
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Historial de Pedidos
        </h2>
        <p className="text-gray-600">
          Esta sección mostrará el historial de pedidos del socio.
        </p>
        {/* TODO: Agregar componente de historial */}
      </div>
    </div>
  );
};

export default PerfilSocioPage;
