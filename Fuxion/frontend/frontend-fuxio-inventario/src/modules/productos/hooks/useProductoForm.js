import { useState } from "react";
import { productosApi } from "../../../api/enpoints/productosApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useProductoForm = (productoId = null) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    sku: "",
    imgUrl: "",
    sticksPorSobre: "",
    precioReferencial: "",
  });

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validar formulario
  const validateForm = () => {
    if (!formData.nombre.trim()) {
      toast.error("El nombre es obligatorio");
      return false;
    }
    if (!formData.sticksPorSobre || formData.sticksPorSobre <= 0) {
      toast.error("Sticks por sobre debe ser mayor a 0");
      return false;
    }
    if (!formData.precioReferencial || formData.precioReferencial <= 0) {
      toast.error("El precio debe ser mayor a 0");
      return false;
    }
    return true;
  };

  // Guardar producto
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const dataToSend = {
        ...formData,
        sticksPorSobre: parseInt(formData.sticksPorSobre),
        precioReferencial: parseFloat(formData.precioReferencial),
      };

      if (productoId) {
        await productosApi.update(productoId, dataToSend);
        toast.success("Producto actualizado correctamente");
      } else {
        await productosApi.create(dataToSend);
        toast.success("Producto creado correctamente");
      }

      navigate("/productos");
    } catch (err) {
      toast.error(
        productoId ? "Error al actualizar" : "Error al crear producto"
      );
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    loading,
  };
};
