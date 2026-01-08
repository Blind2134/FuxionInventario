import { useState, useEffect } from "react";
import { inventarioApi } from "../../../api/enpoints/inventarioApi";
import { toast } from "react-toastify";

export const useInventario = (idSocio = null) => {
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar inventario
  const fetchInventario = async () => {
    try {
      setLoading(true);
      const data = idSocio
        ? await inventarioApi.getBySocio(idSocio)
        : await inventarioApi.getAll();

      setInventario(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error("Error al cargar inventario");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventario();
  }, [idSocio]);

  return {
    inventario,
    loading,
    error,
    refetch: fetchInventario,
  };
};
