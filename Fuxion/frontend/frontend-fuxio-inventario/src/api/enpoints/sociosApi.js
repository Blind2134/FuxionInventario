import api from "../axiosConfig";

export const sociosApi = {
  // Obtener todos los socios
  getAll: async () => {
    const response = await api.get("/usuarios");
    return response.data;
  },

  // Obtener un socio por ID
  getById: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  // Obtener solo socios activos
  getActivos: async () => {
    const response = await api.get("/usuarios/activos");
    return response.data;
  },

  // Obtener socios por rol
  getByRol: async (idRol) => {
    const response = await api.get(`/usuarios/rol/${idRol}`);
    return response.data;
  },

  // Crear nuevo socio
  create: async (data) => {
    const response = await api.post("/usuarios", data);
    return response.data;
  },

  // Actualizar socio
  update: async (id, data) => {
    const response = await api.put(`/usuarios/${id}`, data);
    return response.data;
  },

  // Eliminar socio (soft delete)
  delete: async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },

  // --- AGREGADO: Para cargar el historial en el perfil ---
  getPedidos: async () => {
    const response = await api.get("/pedidos");
    return response.data;
  },
};
