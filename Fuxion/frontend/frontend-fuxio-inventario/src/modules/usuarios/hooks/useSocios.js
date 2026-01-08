import { useState, useEffect } from "react";
import { sociosApi } from "../../../api/enpoints/sociosApi";
import { toast } from "react-toastify";

export const useSocios = () => {
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar socios
  const fetchSocios = async () => {
    try {
      setLoading(true);
      const data = await sociosApi.getAll();
      setSocios(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error("Error al cargar socios");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar socio
  const deleteSocio = async (id) => {
    try {
      await sociosApi.delete(id);
      setSocios(
        socios.map((s) => (s.idUsuario === id ? { ...s, activo: false } : s))
      );
      toast.success("Socio desactivado correctamente");
    } catch (err) {
      toast.error("Error al desactivar socio");
      console.error("Error:", err);
    }
  };

  // Reactivar socio
  const reactivarSocio = async (id) => {
    try {
      const socio = socios.find((s) => s.idUsuario === id);
      await sociosApi.update(id, { ...socio, activo: true });
      setSocios(
        socios.map((s) => (s.idUsuario === id ? { ...s, activo: true } : s))
      );
      toast.success("Socio reactivado correctamente");
    } catch (err) {
      toast.error("Error al reactivar socio");
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    fetchSocios();
  }, []);

  return {
    socios,
    loading,
    error,
    refetch: fetchSocios,
    deleteSocio,
    reactivarSocio,
  };
};
