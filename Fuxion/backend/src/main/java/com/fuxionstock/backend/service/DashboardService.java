package com.fuxionstock.backend.service;

import com.fuxionstock.backend.dto.dashboardDTOS.DashboardResumenDTO;

public interface DashboardService {

    /**
     * Obtiene el resumen completo del dashboard con todos los datos necesarios
     * @return DashboardResumenDTO con KPIs, gráficos, tablas y alertas
     */
    DashboardResumenDTO obtenerResumenCompleto();
}