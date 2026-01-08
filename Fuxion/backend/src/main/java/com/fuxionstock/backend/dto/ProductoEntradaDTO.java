package com.fuxionstock.backend.dto;

import lombok.Data;

@Data
public class ProductoEntradaDTO {
    private Long idProducto;
    private Integer cantidadSobres;
    private Integer cantidadSticks;
}