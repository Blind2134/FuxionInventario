package com.fuxionstock.backend.dto;

import lombok.Data;

@Data
public class ProductoInventarioDTO {
    private Long idProducto;
    private String nombreProducto;
    private String categoria;
    private Integer cantidadSobres;
    private Integer cantidadSticks;
    private Integer sticksPorSobre;
    private Boolean stockBajo;
}