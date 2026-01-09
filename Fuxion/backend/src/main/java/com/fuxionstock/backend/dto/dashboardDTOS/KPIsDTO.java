package com.fuxionstock.backend.dto.dashboardDTOS;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KPIsDTO {
    private Long totalProductos;
    private Long pedidosHoy;
    private Double ventasHoy;
    private Double ventasMes;
    private Long stockBajo;
    private Long prestamosPendientes;
    private Long sociosActivos;
}