import { useState } from "react";
import { inventarioApi } from "../../../api/enpoints/inventarioApi";
import { toast } from "react-toastify";

export const useRegistrarEntrada = () => {
  const [loading, setLoading] = useState(false);

  const registrarEntrada = async (data) => {
    try {
      setLoading(true);
      await inventarioApi.registrarEntrada(data);
      toast.success("Entrada registrada correctamente");
      return true;
    } catch (err) {
      const errorMsg = err.response?.data || "Error al registrar entrada";
      toast.error(errorMsg);
      console.error("Error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    registrarEntrada,
    loading,
  };
};
