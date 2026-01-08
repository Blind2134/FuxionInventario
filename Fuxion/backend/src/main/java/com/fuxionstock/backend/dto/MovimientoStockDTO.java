package com.fuxionstock.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MovimientoStockDTO {
    private Long idMovimiento;
    private LocalDateTime fecha;
    private String tipo;              // ENTRADA, SALIDA, etc.
    private String unidadMedida;      // SOBRE_CERRADO, STICK_SUELTO
    private Integer cantidad;
    private String nombreProducto;
    private String nombreSocio;
    private String observacion;
}