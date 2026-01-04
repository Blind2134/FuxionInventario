package com.fuxionstock.backend.service;

import com.fuxionstock.backend.dto.CrearPedidoDTO;
import com.fuxionstock.backend.entity.Pedido;

public interface PedidoService {

    Pedido crearPedido(CrearPedidoDTO datos);

    Pedido confirmarEntregaAlMotorizado(Long idPedido);


}
