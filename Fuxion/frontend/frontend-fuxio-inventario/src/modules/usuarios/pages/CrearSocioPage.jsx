import { FiArrowLeft, FiUserPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useSocioForm } from "../hooks/useSocioForm";
import SocioForm from "../components/SocioForm";

const CrearSocioPage = () => {
  const { formData, handleChange, handleSubmit, loading, roles } =
    useSocioForm();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header con breadcrumb */}
      <div>
        <Link
          to="/socios"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <FiArrowLeft className="mr-2" />
          Volver a Socios
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FiUserPlus className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Crear Nuevo Socio
            </h1>
            <p className="text-gray-600 mt-1">
              Completa la información del nuevo usuario
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="card">
        <SocioForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          roles={roles}
          isEdit={false}
        />
      </div>

      {/* Información adicional */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">
          ℹ️ Información importante
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• El password debe tener al menos 6 caracteres</li>
          <li>• El email debe ser único en el sistema</li>
          <li>• Los socios quedan activos por defecto</li>
          <li>• El rol determina los permisos del usuario</li>
        </ul>
      </div>
    </div>
  );
};

export default CrearSocioPage;
