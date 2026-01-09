import { useState, useEffect } from "react";
import { pedidosApi } from "../../../api/enpoints/pedidosApi";
import { toast } from "react-toastify";

export const usePedidos = (filtro = "todos", idVendedor = null) => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar pedidos
  const fetchPedidos = async () => {
    try {
      setLoading(true);
      let data;

      if (filtro === "vendedor" && idVendedor) {
        data = await pedidosApi.getByVendedor(idVendedor);
      } else {
        data = await pedidosApi.getAll();
      }

      setPedidos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error("Error al cargar pedidos");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Confirmar entrega
  const confirmarEntrega = async (id) => {
    try {
      await pedidosApi.confirmarEntrega(id);
      toast.success("Entrega confirmada. Comisión calculada.");
      fetchPedidos(); // Recargar lista
      return true;
    } catch (err) {
      const errorMsg = err.response?.data || "Error al confirmar entrega";
      toast.error(errorMsg);
      console.error("Error:", err);
      return false;
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, [filtro, idVendedor]);

  return {
    pedidos,
    loading,
    error,
    refetch: fetchPedidos,
    confirmarEntrega,
  };
};
