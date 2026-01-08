package com.fuxionstock.backend.dto;

import lombok.Data;

@Data
public class AbrirSobreDTO {
    private Long idSocio;      // Dueño del sobre
    private Long idProducto;   // Qué producto
    private Long idAlmacen;    // Almacén (generalmente 1)
    private Integer cantidadSobres; // Cuántos sobres abrir (normalmente 1)
}