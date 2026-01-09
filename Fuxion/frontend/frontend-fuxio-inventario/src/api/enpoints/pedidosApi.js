import api from "../axiosConfig";

export const pedidosApi = {
  // Obtener todos los pedidos
  getAll: async () => {
    const response = await api.get("/pedidos");
    return response.data;
  },

  // Obtener un pedido por ID
  getById: async (id) => {
    const response = await api.get(`/pedidos/${id}`);
    return response.data;
  },

  // Obtener pedidos de un vendedor
  getByVendedor: async (idVendedor) => {
    const response = await api.get(`/pedidos/vendedor/${idVendedor}`);
    return response.data;
  },

  // Crear nuevo pedido
  create: async (data) => {
    const response = await api.post("/pedidos/crear", data);
    return response.data;
  },

  // Confirmar entrega al motorizado
  confirmarEntrega: async (id) => {
    const response = await api.post(`/pedidos/${id}/confirmar-entrega`);
    return response.data;
  },

  // Actualizar estado del pedido
  updateEstado: async (id, estado) => {
    const response = await api.put(`/pedidos/${id}/estado`, { estado });
    return response.data;
  },
};
