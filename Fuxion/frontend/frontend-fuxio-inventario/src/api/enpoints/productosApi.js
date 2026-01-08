import api from "../axiosConfig";

export const productosApi = {
  // Obtener todos los productos
  getAll: async () => {
    const response = await api.get("/productos");
    return response.data;
  },

  // Obtener un producto por ID
  getById: async (id) => {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },

  // Crear nuevo producto
  create: async (data) => {
    const response = await api.post("/productos", data);
    return response.data;
  },

  // Actualizar producto
  update: async (id, data) => {
    const response = await api.put(`/productos/${id}`, data);
    return response.data;
  },

  // Eliminar producto (soft delete)
  delete: async (id) => {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  },
};
