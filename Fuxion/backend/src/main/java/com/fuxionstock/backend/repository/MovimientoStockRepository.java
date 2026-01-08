package com.fuxionstock.backend.repository;

import com.fuxionstock.backend.entity.MovimientoStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MovimientoStockRepository extends JpaRepository<MovimientoStock, Long> {

    // Obtener movimientos por socio
    List<MovimientoStock> findByDuenoIdUsuarioOrderByFechaDesc(Long idSocio);

    // Obtener movimientos por producto
    List<MovimientoStock> findByProductoIdProductoOrderByFechaDesc(Long idProducto);

    // Obtener movimientos por tipo
    List<MovimientoStock> findByTipoOrderByFechaDesc(MovimientoStock.TipoMovimiento tipo);
}