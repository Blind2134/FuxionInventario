package com.fuxionstock.backend.dto;


import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ProductoResponseDTO {

    private Long idProducto;
    private String nombre;
    private String categoria;
    private String sku;
    private String imgUrl;
    private Integer sticksPorSobre;
    private BigDecimal precioReferencial;
    private Boolean activo;
}
