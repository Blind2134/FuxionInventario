package com.fuxionstock.backend.dto.dashboardDTOS;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockCriticoDTO {
    private Long idProducto;
    private String nombreProducto;
    private Integer totalSobres;
    private Integer totalSticks;
    private Integer stockMinimo;
    private String categoria;
}