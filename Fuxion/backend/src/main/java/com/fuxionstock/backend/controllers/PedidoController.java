package com.fuxionstock.backend.controllers;

import com.fuxionstock.backend.dto.CrearPedidoDTO;
import com.fuxionstock.backend.entity.Pedido;
import com.fuxionstock.backend.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    // ==========================================
    // 1. CREAR UN NUEVO PEDIDO
    // URL: POST http://localhost:8080/api/pedidos/crear
    // ==========================================
    @PostMapping("/crear")
    public ResponseEntity<?> crearPedido(@RequestBody CrearPedidoDTO dto) {
        try {
            // Llama al servicio que descuenta stock y valida
            Pedido nuevoPedido = pedidoService.crearPedido(dto);
            return ResponseEntity.ok(nuevoPedido);
        } catch (RuntimeException e) {
            // Si falta stock o el socio no existe, devuelve error 400 y el mensaje
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno: " + e.getMessage());
        }
    }

    // ==========================================
    // 2. CONFIRMAR ENTREGA (Gatilla tu comisión)
    // URL: POST http://localhost:8080/api/pedidos/{id}/confirmar-entrega
    // ==========================================
    @PostMapping("/{id}/confirmar-entrega")
    public ResponseEntity<?> confirmarEntrega(@PathVariable Long id) {
        try {
            // Llama al servicio que cambia estado y calcula $$
            Pedido pedidoActualizado = pedidoService.confirmarEntregaAlMotorizado(id);
            return ResponseEntity.ok(pedidoActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
