package com.fuxionstock.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class CrearPedidoDTO {

    private Long idVendedor;
    private String clienteNombre;
    private String clienteTelefono;
    private String clienteDireccion;

    private List<ItemPedidoDTO> items;


}
