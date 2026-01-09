import { useState, useEffect } from "react";
import { pedidosApi } from "../../../api/enpoints/pedidosApi";
import { toast } from "react-toastify";

export const usePedidoDetalle = (idPedido) => {
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        setLoading(true);
        const data = await pedidosApi.getById(idPedido);
        setPedido(data);
      } catch (err) {
        toast.error("Error al cargar pedido");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (idPedido) {
      fetchPedido();
    }
  }, [idPedido]);

  return {
    pedido,
    loading,
  };
};
