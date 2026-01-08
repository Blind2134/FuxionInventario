package com.fuxionstock.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class RegistrarEntradaDTO {

    private Long idSocio;           // Dueño del stock
    private Long idAlmacen;         // Generalmente 1
    private String observacion;     // Opcional: "Envío desde Lima"

    private List<ProductoEntradaDTO> productos;
}

