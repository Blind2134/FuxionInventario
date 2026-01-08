import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useProductoForm } from "../hooks/useProductoForm";
import ProductoForm from "../components/ProductoForm";

const CrearProductoPage = () => {
  const { formData, handleChange, handleSubmit, loading } = useProductoForm();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header con breadcrumb */}
      <div>
        <Link
          to="/productos"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <FiArrowLeft className="mr-2" />
          Volver a Productos
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Crear Nuevo Producto
        </h1>
        <p className="text-gray-600 mt-1">
          Completa la información del producto FuXion
        </p>
      </div>

      {/* Formulario */}
      <div className="card">
        <ProductoForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          isEdit={false}
        />
      </div>
    </div>
  );
};

export default CrearProductoPage;
