import axios from "../axiosConfig";

export const dashboardApi = {
  /**
   * Obtiene el resumen completo del dashboard
   * @returns {Promise} Datos del dashboard (KPIs, gráficos, tablas)
   */
  getResumen: async () => {
    try {
      const response = await axios.get("/dashboard/resumen");
      return response.data;
    } catch (error) {
      console.error("Error al obtener resumen del dashboard:", error);
      throw error;
    }
  },
};
