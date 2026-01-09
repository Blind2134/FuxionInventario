package com.fuxionstock.backend.dto.dashboardDTOS;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UltimoPedidoDTO {
    private Long idPedido;
    private String codigoPedido;
    private String clienteNombre;
    private Double montoTotalVenta;
    private String estado;
    private LocalDateTime fechaCreacion;
}