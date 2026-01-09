package com.fuxionstock.backend.service.impl;

import com.fuxionstock.backend.dto.dashboardDTOS.*;
import com.fuxionstock.backend.entity.Pedido;
import com.fuxionstock.backend.entity.Prestamo;
import com.fuxionstock.backend.repository.*;
import com.fuxionstock.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final ProductoRepository productoRepository;
    private final PedidoRepository pedidoRepository;
    private final InventarioRepository inventarioRepository;
    private final PrestamoRepository prestamoRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    public DashboardResumenDTO obtenerResumenCompleto() {
        DashboardResumenDTO resumen = new DashboardResumenDTO();

        // Cargar todos los datos
        resumen.setKpis(obtenerKPIs());
        resumen.setVentasUltimos7Dias(obtenerVentasPorDias(7));
        resumen.setVentasUltimos30Dias(obtenerVentasPorDias(30));
        resumen.setTopProductos(obtenerTopProductos(5));
        resumen.setPedidosPorEstado(obtenerPedidosPorEstado());
        resumen.setUltimosPedidos(obtenerUltimosPedidos(5));
        resumen.setStockCritico(obtenerStockCritico());
        resumen.setTopVendedores(obtenerTopVendedores(5));
        resumen.setAlertas(generarAlertas());

        return resumen;
    }

    // ========================================================================
    // MÉTODOS PRIVADOS - KPIs
    // ========================================================================
    private KPIsDTO obtenerKPIs() {
        KPIsDTO kpis = new KPIsDTO();

        // Total de productos activos
        kpis.setTotalProductos(productoRepository.count());

        // Pedidos de hoy
        LocalDateTime inicioDia = LocalDate.now().atStartOfDay();
        LocalDateTime finDia = inicioDia.plusDays(1);
        Long pedidosHoy = pedidoRepository.countByFechaCreacionBetween(inicioDia, finDia);
        kpis.setPedidosHoy(pedidosHoy);

        // Ventas de hoy
        Double ventasHoy = pedidoRepository.sumMontoByFechaCreacionBetween(inicioDia, finDia);
        kpis.setVentasHoy(ventasHoy != null ? ventasHoy : 0.0);

        // Ventas del mes actual
        LocalDateTime inicioMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        Double ventasMes = pedidoRepository.sumMontoByFechaCreacionBetween(inicioMes, LocalDateTime.now());
        kpis.setVentasMes(ventasMes != null ? ventasMes : 0.0);

        // Productos con stock bajo
        List<StockCriticoDTO> listaCritica = obtenerStockCritico(); // Reutilizamos el método privado
        kpis.setStockBajo((long) listaCritica.size()); // Ahora será 1

        // Préstamos pendientes (CORREGIDO: Usando Enum)
        Long prestamosPendientes = prestamoRepository.countByEstado(Prestamo.EstadoPrestamo.PENDIENTE);
        kpis.setPrestamosPendientes(prestamosPendientes);

        // Socios activos
        Long sociosActivos = usuarioRepository.countByActivoTrue();
        kpis.setSociosActivos(sociosActivos);

        return kpis;
    }

    // ========================================================================
    // MÉTODOS PRIVADOS - Ventas por días
    // ========================================================================
    private List<VentaDiaDTO> obtenerVentasPorDias(int dias) {
        LocalDate fechaFin = LocalDate.now();
        LocalDate fechaInicio = fechaFin.minusDays(dias - 1);

        // Obtener todos los pedidos en el rango
        LocalDateTime inicioDateTime = fechaInicio.atStartOfDay();
        LocalDateTime finDateTime = fechaFin.atTime(23, 59, 59);

        List<Pedido> pedidos = pedidoRepository.findByFechaCreacionBetween(inicioDateTime, finDateTime);

        // Agrupar por fecha y sumar montos
        Map<LocalDate, Double> ventasPorDia = pedidos.stream()
                .collect(Collectors.groupingBy(
                        p -> p.getFechaCreacion().toLocalDate(),
                        Collectors.summingDouble(p -> p.getMontoTotalVenta() != null ? p.getMontoTotalVenta().doubleValue() : 0.0)
                ));

        // Crear lista con todas las fechas
        List<VentaDiaDTO> resultado = new ArrayList<>();
        for (LocalDate fecha = fechaInicio; !fecha.isAfter(fechaFin); fecha = fecha.plusDays(1)) {
            Double monto = ventasPorDia.getOrDefault(fecha, 0.0);
            resultado.add(new VentaDiaDTO(fecha, monto));
        }

        return resultado;
    }

    // ========================================================================
    // MÉTODOS PRIVADOS - Top Productos
    // ========================================================================
    private List<TopProductoDTO> obtenerTopProductos(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return pedidoRepository.findTopProductosMasVendidos(pageable);
    }

    // ========================================================================
    // MÉTODOS PRIVADOS - Pedidos por Estado (CORREGIDO AQUÍ)
    // ========================================================================
    private List<PedidoEstadoDTO> obtenerPedidosPorEstado() {
        List<Object[]> resultados = pedidoRepository.countGroupByEstado();

        return resultados.stream()
                .map(r -> new PedidoEstadoDTO(
                        r[0].toString(), // <--- CORRECCIÓN: Usar .toString() en lugar de (String)
                        (Long) r[1]
                ))
                .collect(Collectors.toList());
    }

    // ========================================================================
    // MÉTODOS PRIVADOS - Últimos Pedidos
    // ========================================================================
    private List<UltimoPedidoDTO> obtenerUltimosPedidos(int limit) {
        List<Pedido> pedidos = pedidoRepository.findTop5ByOrderByFechaCreacionDesc();

        return pedidos.stream()
                .map(p -> new UltimoPedidoDTO(
                        p.getIdPedido(),
                        p.getCodigoPedido(),
                        p.getClienteNombre(),
                        p.getMontoTotalVenta() != null ? p.getMontoTotalVenta().doubleValue() : 0.0,
                        p.getEstado().name(), // Correcto: Enum a String
                        p.getFechaCreacion()
                ))
                .collect(Collectors.toList());
    }

    // ========================================================================
    // MÉTODOS PRIVADOS - Stock Crítico
    // ========================================================================
    private List<StockCriticoDTO> obtenerStockCritico() {
        return inventarioRepository.findProductosConStockBajo();
    }

    // ========================================================================
    // MÉTODOS PRIVADOS - Top Vendedores
    // ========================================================================
    private List<TopVendedorDTO> obtenerTopVendedores(int limit) {
        LocalDateTime inicioMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        Pageable pageable = PageRequest.of(0, limit);
        return pedidoRepository.findTopVendedoresDelMes(inicioMes, pageable);
    }

    // ========================================================================
    // MÉTODOS PRIVADOS - Alertas
    // ========================================================================
    private List<AlertaDTO> generarAlertas() {
        List<AlertaDTO> alertas = new ArrayList<>();

        // Alerta de stock bajo
        Long stockBajo = inventarioRepository.countByStockBajo();
        if (stockBajo > 0) {
            alertas.add(new AlertaDTO(
                    "STOCK_BAJO",
                    stockBajo + " productos con stock bajo",
                    "ALTA"
            ));
        }

        // Alerta de préstamos pendientes (CORREGIDO: Usando Enum)
        Long prestamosPendientes = prestamoRepository.countByEstado(Prestamo.EstadoPrestamo.PENDIENTE);
        if (prestamosPendientes > 0) {
            alertas.add(new AlertaDTO(
                    "PRESTAMOS_PENDIENTES",
                    prestamosPendientes + " préstamos pendientes de devolución",
                    "MEDIA"
            ));
        }

        // Alerta de pedidos pendientes (CORREGIDO: Usando Enum)
        Long pedidosPendientes = pedidoRepository.countByEstado(Pedido.EstadoPedido.PENDIENTE);
        if (pedidosPendientes > 0) {
            alertas.add(new AlertaDTO(
                    "PEDIDOS_PENDIENTES",
                    pedidosPendientes + " pedidos pendientes de empaquetar",
                    "MEDIA"
            ));
        }

        return alertas;
    }
}