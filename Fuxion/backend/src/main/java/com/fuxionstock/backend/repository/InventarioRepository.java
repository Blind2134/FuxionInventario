package com.fuxionstock.backend.repository;

import com.fuxionstock.backend.dto.dashboardDTOS.StockCriticoDTO;
import com.fuxionstock.backend.entity.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface InventarioRepository extends JpaRepository<Inventario, Long> {

    Optional<Inventario> findByDuenoIdUsuarioAndProductoIdProducto(Long idDueno, Long idProducto);
    List<Inventario> findByDuenoIdUsuario(Long idDueno);


    // NUEVOS MÉTODOS PARA EL DASHBOARD:

    // Contar inventarios con stock bajo
    @Query("SELECT COUNT(i) FROM Inventario i WHERE i.stockBajo = true")
    Long countByStockBajo();

    @Query("""
    SELECT new com.fuxionstock.backend.dto.dashboardDTOS.StockCriticoDTO(
        p.idProducto,
        p.nombre,
        CAST(COALESCE(SUM(i.cantidadSobres), 0) AS int),
        CAST(COALESCE(SUM(i.cantidadSticks), 0) AS int),
        5,
        CAST(p.categoria AS string)
    )
    FROM Inventario i
    JOIN i.producto p
    GROUP BY p.idProducto, p.nombre, p.categoria
    HAVING CAST(COALESCE(SUM(i.cantidadSobres), 0) AS int) <= 1
    ORDER BY COALESCE(SUM(i.cantidadSobres), 0) ASC
""")
    List<StockCriticoDTO> findProductosConStockBajo();

    @Query("SELECT COUNT(DISTINCT p.idProducto) " +
            "FROM Inventario i JOIN i.producto p " +
            "GROUP BY p.idProducto " +
            "HAVING CAST(COALESCE(SUM(i.cantidadSobres), 0) AS int) <= 1")
    Long contarProductosEnStockCritico();
}

