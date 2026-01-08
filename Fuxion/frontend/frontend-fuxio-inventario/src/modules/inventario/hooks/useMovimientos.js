import { useState, useEffect } from "react";
import { inventarioApi } from "../../../api/enpoints/inventarioApi";
import { toast } from "react-toastify";

export const useMovimientos = (idSocio) => {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        setLoading(true);
        const data = await inventarioApi.getMovimientosBySocio(idSocio);
        setMovimientos(data);
      } catch (err) {
        toast.error("Error al cargar movimientos");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (idSocio) {
      fetchMovimientos();
    }
  }, [idSocio]);

  return {
    movimientos,
    loading,
  };
};
