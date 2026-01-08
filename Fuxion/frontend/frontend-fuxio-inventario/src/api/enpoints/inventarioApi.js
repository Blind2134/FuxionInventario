import api from "../axiosConfig";

export const inventarioApi = {
  // Obtener inventario general (todos los socios)
  getAll: async () => {
    const response = await api.get("/inventario");
    return response.data;
  },

  // Obtener inventario de un socio específico
  getBySocio: async (idSocio) => {
    const response = await api.get(`/inventario/socio/${idSocio}`);
    return response.data;
  },

  // Registrar entrada de productos (cuando un socio envía)
  registrarEntrada: async (data) => {
    const response = await api.post("/inventario/entrada", data);
    return response.data;
  },

  // Abrir sobre (convertir sobres a sticks)
  abrirSobre: async (data) => {
    const response = await api.post("/inventario/abrir-sobre", data);
    return response.data;
  },

  // Obtener movimientos de un socio
  getMovimientosBySocio: async (idSocio) => {
    const response = await api.get(`/inventario/movimientos/socio/${idSocio}`);
    return response.data;
  },
};
