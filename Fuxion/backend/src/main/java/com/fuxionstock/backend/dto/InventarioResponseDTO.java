package com.fuxionstock.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class InventarioResponseDTO {
    private Long idSocio;
    private String nombreSocio;
    private List<ProductoInventarioDTO> productos;
    private Integer totalSobres;
    private Integer totalSticks;
}

