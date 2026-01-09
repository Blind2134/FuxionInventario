package com.fuxionstock.backend.dto.dashboardDTOS;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopVendedorDTO {
    private Long idUsuario;
    private String nombreSocio;
    private Double totalVentas;
    private Long numeroPedidos;
}