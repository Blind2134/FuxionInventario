package com.fuxionstock.backend.dto;

import lombok.Data;

@Data
public class ItemPedidoDTO {

    private Long idProducto;
    private Integer cantidadSobres; // <--- NUEVO
    private Integer cantidadSticks;
    private Long idDuenoStock;
    private boolean esRegaloSobre;
    private boolean esRegaloStick;
}
