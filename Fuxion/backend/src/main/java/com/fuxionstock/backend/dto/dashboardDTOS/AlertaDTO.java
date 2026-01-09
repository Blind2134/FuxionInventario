package com.fuxionstock.backend.dto.dashboardDTOS;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlertaDTO {
    private String tipo; // STOCK_BAJO, PRESTAMOS_PENDIENTES, PEDIDOS_PENDIENTES
    private String mensaje;
    private String prioridad; // ALTA, MEDIA, BAJA
}