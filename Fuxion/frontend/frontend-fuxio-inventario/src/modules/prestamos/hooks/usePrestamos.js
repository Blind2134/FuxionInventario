import { useState, useEffect, useCallback } from "react";
import { prestamosApi } from "../../../api/enpoints/prestamosApi";

export const usePrestamos = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener todos los préstamos
  const cargarPrestamos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await prestamosApi.getAll();
      setPrestamos(data);
    } catch (err) {
      setError(err.message || "Error al cargar el historial de préstamos");
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para marcar un préstamo como devuelto/pagado
  const marcarComoPagado = async (idPrestamo) => {
    try {
      await prestamosApi.marcarPagado(idPrestamo);
      // Actualizamos la lista localmente para no recargar toda la página
      setPrestamos((prev) =>
        prev.map((p) =>
          p.idPrestamo === idPrestamo ? { ...p, estado: "PAGADO" } : p
        )
      );
      return true;
    } catch (err) {
      alert("Error al actualizar estado: " + err.message);
      return false;
    }
  };

  // Carga inicial
  useEffect(() => {
    cargarPrestamos();
  }, [cargarPrestamos]);

  // Calculamos métricas simples para mostrar en la UI
  const estadisticas = {
    totalPendientes: prestamos.filter((p) => p.estado === "PENDIENTE").length,
    totalPagados: prestamos.filter((p) => p.estado === "PAGADO").length,
  };

  return {
    prestamos,
    estadisticas,
    loading,
    error,
    recargar: cargarPrestamos,
    marcarComoPagado,
  };
};
