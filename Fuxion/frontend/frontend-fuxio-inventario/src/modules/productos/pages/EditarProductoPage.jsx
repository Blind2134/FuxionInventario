import { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { useProductoForm } from "../hooks/useProductoForm";
import { productosApi } from "../../../api/enpoints/productosApi";
import ProductoForm from "../components/ProductoForm";
import { toast } from "react-toastify";

const EditarProductoPage = () => {
  const { id } = useParams();
  const { formData, setFormData, handleChange, handleSubmit, loading } =
    useProductoForm(id);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const data = await productosApi.getById(id);
        setFormData({
          nombre: data.nombre,
          categoria: data.categoria || "",
          sku: data.sku || "",
          imgUrl: data.imgUrl || "",
          sticksPorSobre: data.sticksPorSobre,
          precioReferencial: data.precioReferencial,
        });
      } catch (err) {
        toast.error("Error al cargar el producto");
        console.error("Error:", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchProducto();
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
          to="/productos"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <FiArrowLeft className="mr-2" />
          Volver a Productos
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Editar Producto</h1>
        <p className="text-gray-600 mt-1">
          Modifica la información del producto
        </p>
      </div>

      {/* Formulario */}
      <div className="card">
        <ProductoForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          isEdit={true}
        />
      </div>
    </div>
  );
};

export default EditarProductoPage;
