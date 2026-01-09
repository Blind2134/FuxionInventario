// src/modules/dashboard/hooks/useDashboardData.js
import { useState, useEffect } from "react";
import { dashboardApi } from "../../../api/enpoints/dashboardApi";
import { toast } from "react-toastify";

export const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const resumen = await dashboardApi.getResumen();
      setData(resumen);
    } catch (err) {
      console.error("Error al cargar dashboard:", err);
      setError(err.message || "Error al cargar datos del dashboard");
      toast.error("Error al cargar el dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: cargarDatos,
  };
};
