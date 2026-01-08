package com.fuxionstock.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
@Data
public class CrearProductoDTO {

    @NotBlank
    private String nombre;

    private String categoria;

    private String sku;

    private String imgUrl;

    @NotNull
    private Integer sticksPorSobre;

    @NotNull
    private BigDecimal precioReferencial;

}
