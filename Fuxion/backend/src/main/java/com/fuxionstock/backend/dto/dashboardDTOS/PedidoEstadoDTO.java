package com.fuxionstock.backend.dto.dashboardDTOS;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoEstadoDTO {
    private String estado; // PENDIENTE, EMPAQUETADO, ENTREGADO
    private Long cantidad;
}