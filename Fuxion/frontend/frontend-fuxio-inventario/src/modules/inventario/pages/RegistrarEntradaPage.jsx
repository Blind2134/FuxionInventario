import { FiArrowLeft, FiPackage } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useSocios } from "../../usuarios/hooks/useSocios";
import { useProductos } from "../../productos/hooks/useProductos";
import { useRegistrarEntrada } from "../hooks/useRegistrarEntrada";
import RegistrarEntradaForm from "../components/RegistrarEntradaForm";

const RegistrarEntradaPage = () => {
  const navigate = useNavigate();
  const { socios, loading: loadingSocios } = useSocios();
  const { productos, loading: loadingProductos } = useProductos();
  const { registrarEntrada, loading } = useRegistrarEntrada();

  const handleSubmit = async (data) => {
    const success = await registrarEntrada(data);
    if (success) {
      navigate("/inventario");
    }
  };

  if (loadingSocios || loadingProductos) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/inventario"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <FiArrowLeft className="mr-2" />
          Volver a Inventario
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FiPackage className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Registrar Entrada de Stock
            </h1>
            <p className="text-gray-600 mt-1">
              Registra productos que te envían los socios
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="card">
        <RegistrarEntradaForm
          socios={socios.filter((s) => s.activo)}
          productos={productos}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>

      {/* Información */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Información</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Registra los productos que te envía cada socio</li>
          <li>• Puedes agregar sobres completos y/o sticks sueltos</li>
          <li>• El stock se sumará automáticamente al inventario del socio</li>
          <li>
            • Agrega una observación para identificar el envío (ej: "Por courier
            desde Lima")
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RegistrarEntradaPage;
