import api from "../axiosConfig";

export const prestamosApi = {
  // Obtener todos los préstamos
  getAll: async () => {
    const response = await api.get("/prestamos");
    return response.data;
  },

  // Obtener préstamos pendientes
  getPendientes: async () => {
    const response = await api.get("/prestamos/pendientes");
    return response.data;
  },

  // Obtener préstamos donde un socio es deudor
  getByDeudor: async (idSocio) => {
    const response = await api.get(`/prestamos/deudor/${idSocio}`);
    return response.data;
  },

  // Obtener préstamos donde un socio es acreedor
  getByAcreedor: async (idSocio) => {
    const response = await api.get(`/prestamos/acreedor/${idSocio}`);
    return response.data;
  },

  // Crear nuevo préstamo
  create: async (data) => {
    const response = await api.post("/prestamos", data);
    return response.data;
  },

  // Marcar préstamo como pagado/devuelto
  marcarPagado: async (id) => {
    const response = await api.put(`/prestamos/${id}/pagar`);
    return response.data;
  },
};
