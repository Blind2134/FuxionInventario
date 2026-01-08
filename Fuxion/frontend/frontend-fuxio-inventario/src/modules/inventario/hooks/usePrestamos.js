import { useState, useEffect } from "react";
import { prestamosApi } from "../../../api/endpoints/prestamosApi";
import { toast } from "react-toastify";

export const usePrestamos = (tipo = "todos", idSocio = null) => {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar préstamos
  const fetchPrestamos = async () => {
    try {
      setLoading(true);
      let data;

      switch (tipo) {
        case "pendientes":
          data = await prestamosApi.getPendientes();
          break;
        case "deudor":
          data = await prestamosApi.getByDeudor(idSocio);
          break;
        case "acreedor":
          data = await prestamosApi.getByAcreedor(idSocio);
          break;
        default:
          data = await prestamosApi.getAll();
      }

      setPrestamos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error("Error al cargar préstamos");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Crear préstamo
  const crearPrestamo = async (data) => {
    try {
      await prestamosApi.create(data);
      toast.success("Préstamo registrado correctamente");
      fetchPrestamos(); // Recargar lista
      return true;
    } catch (err) {
      const errorMsg = err.response?.data || "Error al crear préstamo";
      toast.error(errorMsg);
      console.error("Error:", err);
      return false;
    }
  };

  // Marcar como pagado
  const marcarPagado = async (id) => {
    try {
      await prestamosApi.marcarPagado(id);
      toast.success("Préstamo marcado como pagado");
      fetchPrestamos(); // Recargar lista
      return true;
    } catch (err) {
      const errorMsg = err.response?.data || "Error al marcar préstamo";
      toast.error(errorMsg);
      console.error("Error:", err);
      return false;
    }
  };

  useEffect(() => {
    fetchPrestamos();
  }, [tipo, idSocio]);

  return {
    prestamos,
    loading,
    error,
    refetch: fetchPrestamos,
    crearPrestamo,
    marcarPagado,
  };
};
