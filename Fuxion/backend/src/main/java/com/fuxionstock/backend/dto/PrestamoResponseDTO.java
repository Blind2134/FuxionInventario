package com.fuxionstock.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PrestamoResponseDTO {
    private Long idPrestamo;
    private LocalDateTime fecha;
    private String estado;                  // PENDIENTE, PAGADO

    // Deudor (quien pidió prestado)
    private Long idSocioDeudor;
    private String nombreSocioDeudor;

    // Acreedor (quien prestó)
    private Long idSocioAcreedor;
    private String nombreSocioAcreedor;

    // Producto
    private Long idProducto;
    private String nombreProducto;
    private Integer cantidadSticks;
    private Integer cantidadSobres;

    // Pedido relacionado (opcional)
    private Long idPedido;
    private String codigoPedido;

}