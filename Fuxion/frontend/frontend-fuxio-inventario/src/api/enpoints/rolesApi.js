import api from "../axiosConfig";

export const rolesApi = {
  // Obtener todos los roles
  getAll: async () => {
    const response = await api.get("/roles");
    return response.data;
  },

  // Obtener un rol por ID
  getById: async (id) => {
    const response = await api.get(`/roles/${id}`);
    return response.data;
  },
};
