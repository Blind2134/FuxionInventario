import { useState, useEffect } from "react";
import { productosApi } from "../../../api/enpoints/productosApi";
import { toast } from "react-toastify";

export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar productos
  const fetchProductos = async () => {
    try {
      setLoading(true);
      const data = await productosApi.getAll();
      setProductos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error("Error al cargar productos");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar producto
  const deleteProducto = async (id) => {
    try {
      await productosApi.delete(id);
      setProductos(productos.filter((p) => p.idProducto !== id));
      toast.success("Producto eliminado correctamente");
    } catch (err) {
      toast.error("Error al eliminar producto");
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return {
    productos,
    loading,
    error,
    refetch: fetchProductos,
    deleteProducto,
  };
};
