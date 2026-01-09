package com.fuxionstock.backend.dto;

import lombok.Data;

@Data
public class CrearPrestamoDTO {
    private Long idAlmacen;
    private Long idSocioDeudor;      // Quien pide prestado (Jeampier)
    private Long idSocioAcreedor;    // Quien presta (Betzaida)
    private Long idProducto;
    private Integer cantidadSobres;
    private Integer cantidadSticks;  // Cuántos sticks presta
    private String observacion;      // "Para pedido #123"
}