package com.fuxionstock.backend.repository;

import com.fuxionstock.backend.dto.dashboardDTOS.TopProductoDTO;
import com.fuxionstock.backend.dto.dashboardDTOS.TopVendedorDTO;
import com.fuxionstock.backend.entity.Pedido;
import org.springframework.data.domain.Pageable; // ⚠️ CORRECCIÓN: Usa este import
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Método que ya tenías
    List<Pedido> findByVendedorIdUsuario(Long idVendedor);

    List<Pedido> findAllByOrderByFechaCreacionDesc();

    // MÉTODOS PARA EL DASHBOARD:

    Long countByFechaCreacionBetween(LocalDateTime inicio, LocalDateTime fin);

    @Query("SELECT COALESCE(SUM(p.montoTotalVenta), 0.0) FROM Pedido p WHERE p.fechaCreacion BETWEEN :inicio AND :fin")
    Double sumMontoByFechaCreacionBetween(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    List<Pedido> findByFechaCreacionBetween(LocalDateTime inicio, LocalDateTime fin);

    // Top productos más vendidos
    @Query("""
        SELECT new com.fuxionstock.backend.dto.dashboardDTOS.TopProductoDTO(
            p.idProducto, 
            p.nombre, 
            SUM(d.cantidadSobres + d.cantidadSticks)
        )
        FROM DetallePedido d
        JOIN d.producto p
        GROUP BY p.idProducto, p.nombre
        ORDER BY SUM(d.cantidadSobres + d.cantidadSticks) DESC
    """)
    List<TopProductoDTO> findTopProductosMasVendidos(Pageable pageable);

    @Query("SELECT p.estado, COUNT(p) FROM Pedido p GROUP BY p.estado")
    List<Object[]> countGroupByEstado();

    List<Pedido> findTop5ByOrderByFechaCreacionDesc();

    Long countByEstado(Pedido.EstadoPedido estado);

    // Top vendedores del mes - CONVERTIR BigDecimal a Double con CAST
    @Query("""
        SELECT new com.fuxionstock.backend.dto.dashboardDTOS.TopVendedorDTO(
            v.idUsuario,
            v.nombre,
            CAST(SUM(p.montoTotalVenta) AS double),
            COUNT(p)
        )
        FROM Pedido p
        JOIN p.vendedor v
        WHERE p.fechaCreacion >= :inicioMes
        GROUP BY v.idUsuario, v.nombre
        ORDER BY SUM(p.montoTotalVenta) DESC
    """)
    List<TopVendedorDTO> findTopVendedoresDelMes(@Param("inicioMes") LocalDateTime inicioMes, Pageable pageable);
}