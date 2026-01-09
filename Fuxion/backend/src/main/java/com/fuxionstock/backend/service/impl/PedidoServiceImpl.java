package com.fuxionstock.backend.service.impl;

import com.fuxionstock.backend.dto.CrearPedidoDTO;
import com.fuxionstock.backend.dto.ItemPedidoDTO;
import com.fuxionstock.backend.entity.*;
import com.fuxionstock.backend.repository.*;
import com.fuxionstock.backend.service.PedidoService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class PedidoServiceImpl implements PedidoService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
    private InventarioRepository inventarioRepository;
    @Autowired
    private PedidoRepository pedidoRepository;
    @Autowired
    private PrestamoRepository prestamoRepository;

    @Override
    @Transactional
    public Pedido crearPedido(CrearPedidoDTO datos) {

        // 1. Validar Vendedor
        Usuario vendedor = usuarioRepository.findById(datos.getIdVendedor())
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));

        // 2. Cabecera Pedido
        Pedido nuevoPedido = new Pedido();
        nuevoPedido.setVendedor(vendedor);
        nuevoPedido.setClienteNombre(datos.getClienteNombre());
        nuevoPedido.setClienteTelefono(datos.getClienteTelefono());
        nuevoPedido.setClienteDireccion(datos.getClienteDireccion());
        nuevoPedido.setEstado(Pedido.EstadoPedido.PENDIENTE);
        nuevoPedido.setFechaCreacion(LocalDateTime.now());
        nuevoPedido.setCodigoPedido("PED-" + System.currentTimeMillis());

        // Inicializamos la lista de detalles
        if (nuevoPedido.getDetalles() == null) {
            nuevoPedido.setDetalles(new ArrayList<>());
        }

        Almacen almacen = new Almacen();
        almacen.setIdAlmacen(1L);
        nuevoPedido.setAlmacen(almacen);

        // Guardar el pedido antes de procesar items (para generar ID)
        nuevoPedido = pedidoRepository.save(nuevoPedido);

        BigDecimal totalVenta = BigDecimal.ZERO;

        // 3. Procesar Items
        for (ItemPedidoDTO item : datos.getItems()) {

            Producto producto = productoRepository.findById(item.getIdProducto())
                    .orElseThrow(() -> new RuntimeException("Producto no existe ID: " + item.getIdProducto()));

            // A. DETERMINAR DUEÑO DEL STOCK
            Long idDuenoStock = (item.getIdDuenoStock() != null) ? item.getIdDuenoStock() : vendedor.getIdUsuario();

            Usuario duenoStock = usuarioRepository.findById(idDuenoStock)
                    .orElseThrow(() -> new RuntimeException("Dueño de stock no encontrado ID: " + idDuenoStock));

            // B. BUSCAR INVENTARIO
            Inventario inv = inventarioRepository.findByDuenoIdUsuarioAndProductoIdProducto(idDuenoStock, producto.getIdProducto())
                    .orElseThrow(() -> new RuntimeException("El socio " + duenoStock.getNombre() + " no tiene inventario de " + producto.getNombre()));

            // C. VALIDAR Y RESTAR
            int sobresPedidos = item.getCantidadSobres() != null ? item.getCantidadSobres() : 0;
            int sticksPedidos = item.getCantidadSticks() != null ? item.getCantidadSticks() : 0;

            if (inv.getCantidadSobres() < sobresPedidos) {
                throw new RuntimeException("Stock insuficiente (Sobres) de " + producto.getNombre() + " donde " + duenoStock.getNombre());
            }
            if (inv.getCantidadSticks() < sticksPedidos) {
                throw new RuntimeException("Stock insuficiente (Sticks) de " + producto.getNombre() + " donde " + duenoStock.getNombre());
            }

            inv.setCantidadSobres(inv.getCantidadSobres() - sobresPedidos);
            inv.setCantidadSticks(inv.getCantidadSticks() - sticksPedidos);

            // ⭐ CALCULAR STOCK BAJO DESPUÉS DE RESTAR
            inv.calcularStockBajo();

            inventarioRepository.save(inv);

            // D. REGISTRAR PRÉSTAMO (SI APLICA)
            if (!duenoStock.getIdUsuario().equals(vendedor.getIdUsuario())) {
                Prestamo prestamo = new Prestamo();
                prestamo.setAlmacen(nuevoPedido.getAlmacen());
                prestamo.setPedidoOrigen(nuevoPedido);
                prestamo.setSocioDeudor(vendedor);
                prestamo.setSocioAcreedor(duenoStock);
                prestamo.setProducto(producto);
                prestamo.setCantidadSobres(sobresPedidos);
                prestamo.setCantidadSticks(sticksPedidos);
                prestamo.setFechaPrestamo(LocalDateTime.now());
                prestamo.setEstado(Prestamo.EstadoPrestamo.PENDIENTE);

                prestamoRepository.save(prestamo);
            }

            // E. CÁLCULOS
            BigDecimal precioCajaBase = producto.getPrecioReferencial();
            BigDecimal sticksPorCaja = new BigDecimal(producto.getSticksPorSobre());
            BigDecimal precioStickBase = precioCajaBase.divide(sticksPorCaja, 2, RoundingMode.HALF_UP);

            BigDecimal costoSobres = item.isEsRegaloSobre() ? BigDecimal.ZERO : precioCajaBase.multiply(new BigDecimal(sobresPedidos));
            BigDecimal costoSticks = item.isEsRegaloStick() ? BigDecimal.ZERO : precioStickBase.multiply(new BigDecimal(sticksPedidos));

            totalVenta = totalVenta.add(costoSobres).add(costoSticks);

            // F. DETALLE
            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(nuevoPedido);
            detalle.setProducto(producto);
            detalle.setDuenoStock(duenoStock);
            detalle.setCantidadSobres(sobresPedidos);
            detalle.setCantidadSticks(sticksPedidos);
            detalle.setEsRegaloSobre(item.isEsRegaloSobre());
            detalle.setEsRegaloStick(item.isEsRegaloStick());
            detalle.setPrecioUnitarioSobre(item.isEsRegaloSobre() ? BigDecimal.ZERO : precioCajaBase);
            detalle.setPrecioUnitarioStick(item.isEsRegaloStick() ? BigDecimal.ZERO : precioStickBase);

            nuevoPedido.getDetalles().add(detalle);
        }

        // Actualizar monto total y guardar
        nuevoPedido.setMontoTotalVenta(totalVenta);

        return pedidoRepository.save(nuevoPedido);
    }

    @Override
    public Pedido confirmarEntregaAlMotorizado(Long idPedido) {
        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (pedido.getEstado() == Pedido.EstadoPedido.ENTREGADO_MOTORIZADO) {
            throw new RuntimeException("Este pedido ya fue entregado.");
        }

        pedido.setEstado(Pedido.EstadoPedido.ENTREGADO_MOTORIZADO);

        // Calcular ganancia del almacenero (3% min 1 sol max 5 soles)
        BigDecimal comision = calcularComisionLogica(pedido.getMontoTotalVenta());
        pedido.setComisionAlmacenero(comision);

        return pedidoRepository.save(pedido);
    }

    private BigDecimal calcularComisionLogica(BigDecimal monto) {
        if (monto == null) return BigDecimal.ZERO;
        BigDecimal porcentaje = new BigDecimal("0.03");
        BigDecimal calculo = monto.multiply(porcentaje);
        BigDecimal minimo = new BigDecimal("1.00");
        BigDecimal maximo = new BigDecimal("5.00");

        if (calculo.compareTo(minimo) < 0) return minimo;
        if (calculo.compareTo(maximo) > 0) return maximo;
        return calculo;
    }
}