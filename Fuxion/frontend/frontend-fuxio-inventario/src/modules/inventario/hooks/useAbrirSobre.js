import { useState } from "react";
import { inventarioApi } from "../../../api/enpoints/inventarioApi";
import { toast } from "react-toastify";

export const useAbrirSobre = () => {
  const [loading, setLoading] = useState(false);

  const abrirSobre = async (data) => {
    try {
      setLoading(true);
      const response = await inventarioApi.abrirSobre(data);

      toast.success(
        `✅ ${response.sobresAbiertos} sobre(s) abierto(s). 
        Generados ${response.sticksGenerados} sticks`
      );

      return response;
    } catch (err) {
      const errorMsg = err.response?.data || "Error al abrir sobre";
      toast.error(errorMsg);
      console.error("Error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    abrirSobre,
    loading,
  };
};
