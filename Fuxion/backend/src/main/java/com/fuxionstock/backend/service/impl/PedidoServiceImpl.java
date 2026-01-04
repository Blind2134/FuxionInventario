package com.fuxionstock.backend.service.impl;

import com.fuxionstock.backend.dto.CrearPedidoDTO;
import com.fuxionstock.backend.dto.ItemPedidoDTO;
import com.fuxionstock.backend.entity.*;
import com.fuxionstock.backend.repository.*;
import com.fuxionstock.backend.service.PedidoService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service // ¡Importante! Esto le dice a Spring que esta es la clase que hace el trabajo
public class PedidoServiceImpl implements PedidoService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
    private InventarioRepository inventarioRepository;
    @Autowired
    private PedidoRepository pedidoRepository;

    // ==========================================================
    // MÉTODO 1: CREAR EL PEDIDO (Descuenta stock)
    // ==========================================================
    @Override
    @Transactional
    public Pedido crearPedido(CrearPedidoDTO datos) {

        // 1. Validar Vendedor
        Usuario vendedor = usuarioRepository.findById(datos.getIdVendedor())
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));

        // 2. Crear Cabecera del Pedido
        Pedido nuevoPedido = new Pedido();
        nuevoPedido.setVendedor(vendedor);
        nuevoPedido.setClienteNombre(datos.getClienteNombre());
        nuevoPedido.setClienteTelefono(datos.getClienteTelefono());
        nuevoPedido.setClienteDireccion(datos.getClienteDireccion());
        nuevoPedido.setEstado(Pedido.EstadoPedido.PENDIENTE);

        // Asignamos almacén por defecto (ID 1)
        Almacen almacen = new Almacen();
        almacen.setIdAlmacen(1L);
        nuevoPedido.setAlmacen(almacen);

        BigDecimal totalVenta = BigDecimal.ZERO;

        // 3. Procesar Items
        for (ItemPedidoDTO item : datos.getItems()) {

            Producto producto = productoRepository.findById(item.getIdProducto())
                    .orElseThrow(() -> new RuntimeException("Producto no existe ID: " + item.getIdProducto()));

            Inventario inv = inventarioRepository.findByDuenoIdUsuarioAndProductoIdProducto(vendedor.getIdUsuario(), producto.getIdProducto())
                    .orElseThrow(() -> new RuntimeException("El socio no tiene inventario de " + producto.getNombre()));

            // VALIDACIÓN CRÍTICA: SOLO STICKS SUELTOS
            if (inv.getCantidadSticks() < item.getCantidadSticks()) {
                throw new RuntimeException("Stock insuficiente de sticks para: " + producto.getNombre() +
                        ". Tienes " + inv.getCantidadSticks() + ", necesitas " + item.getCantidadSticks() +
                        ". ¡Usa el botón ABRIR SOBRE primero!");
            }

            // Restar Stock
            inv.setCantidadSticks(inv.getCantidadSticks() - item.getCantidadSticks());
            inventarioRepository.save(inv);

            // Crear Detalle
            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(nuevoPedido); // Relación bidireccional
            detalle.setProducto(producto);
            detalle.setDuenoStock(vendedor);
            detalle.setCantidadSticks(item.getCantidadSticks());
            detalle.setCantidadSobres(0);

            // Calcular Precio (Proporcional al Stick)
            BigDecimal precioCaja = producto.getPrecioReferencial(); // Ej: 120.00
            BigDecimal sticksPorCaja = new BigDecimal(producto.getSticksPorSobre()); // Ej: 28

            // Precio Unitario = 120 / 28
            BigDecimal precioUnitario = precioCaja.divide(sticksPorCaja, 2, RoundingMode.HALF_UP);
            BigDecimal subtotal = precioUnitario.multiply(new BigDecimal(item.getCantidadSticks()));

            totalVenta = totalVenta.add(subtotal);

            // Agregar a la lista del pedido
            nuevoPedido.getDetalles().add(detalle);
        }

        nuevoPedido.setMontoTotalVenta(totalVenta);
        nuevoPedido.setCodigoPedido("PED-" + System.currentTimeMillis());

        return pedidoRepository.save(nuevoPedido);
    }

    // ==========================================================
    // MÉTODO 2: CONFIRMAR ENTREGA (Calcula tu ganancia)
    // ==========================================================
    @Override
    public Pedido confirmarEntregaAlMotorizado(Long idPedido) {
        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (pedido.getEstado() == Pedido.EstadoPedido.ENTREGADO_MOTORIZADO) {
            throw new RuntimeException("Este pedido ya fue entregado y la comisión cobrada.");
        }

        // Cambio de estado
        pedido.setEstado(Pedido.EstadoPedido.ENTREGADO_MOTORIZADO);

        // Lógica de Negocio: Calcular Comisión
        BigDecimal comision = calcularComisionLogica(pedido.getMontoTotalVenta());
        pedido.setComisionAlmacenero(comision);

        return pedidoRepository.save(pedido);
    }

    // Método privado (No se ve desde fuera, solo lo usa esta clase)
    private BigDecimal calcularComisionLogica(BigDecimal monto) {
        if (monto == null) return BigDecimal.ZERO;

        BigDecimal porcentaje = new BigDecimal("0.03");
        BigDecimal calculo = monto.multiply(porcentaje);

        BigDecimal minimo = new BigDecimal("1.00");
        BigDecimal maximo = new BigDecimal("5.00");

        // Reglas: Min 1, Max 5
        if (calculo.compareTo(minimo) < 0) return minimo;
        if (calculo.compareTo(maximo) > 0) return maximo;
        return calculo;
    }
}