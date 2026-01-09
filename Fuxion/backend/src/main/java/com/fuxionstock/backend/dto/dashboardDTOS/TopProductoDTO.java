package com.fuxionstock.backend.dto.dashboardDTOS;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopProductoDTO {
    private Long idProducto;
    private String nombreProducto;
    private Long cantidadVendida; // Total de sobres + sticks vendidos
}