import { useEffect, useState } from "react";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { useSocioForm } from "../hooks/useSocioForm";
import { sociosApi } from "../../../api/enpoints/sociosApi";
import SocioForm from "../components/SocioForm";
import { toast } from "react-toastify";

const EditarSocioPage = () => {
  const { id } = useParams();
  const { formData, setFormData, handleChange, handleSubmit, loading, roles } =
    useSocioForm(id);
  const [loadingData, setLoadingData] = useState(true);
  const [socioNombre, setSocioNombre] = useState("");

  useEffect(() => {
    const fetchSocio = async () => {
      try {
        const data = await sociosApi.getById(id);
        setSocioNombre(data.nombre);
        setFormData({
          nombre: data.nombre,
          email: data.email,
          password: "",
          confirmarPassword: "",
          telefono: data.telefono || "",
          idRol: data.idRol,
          activo: data.activo,
        });
      } catch (err) {
        toast.error("Error al cargar el socio");
        console.error("Error:", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchSocio();
  }, [id, setFormData]);

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/usuarios"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <FiArrowLeft className="mr-2" />
          Volver a Socios
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FiEdit2 className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Socio</h1>
            <p className="text-gray-600 mt-1">
              Modificando: <span className="font-semibold">{socioNombre}</span>
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
          isEdit={true}
        />
      </div>

      {/* Información adicional */}
      <div className="card bg-yellow-50 border-yellow-200">
        <h3 className="font-semibold text-yellow-900 mb-2">
          ⚠️ Nota importante
        </h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• El password no se puede cambiar desde aquí por seguridad</li>
          <li>• Si cambias el email, debe ser único en el sistema</li>
          <li>• Puedes desactivar el socio desmarcando "Usuario activo"</li>
          <li>• Los cambios de rol afectan inmediatamente los permisos</li>
        </ul>
      </div>
    </div>
  );
};

export default EditarSocioPage;
