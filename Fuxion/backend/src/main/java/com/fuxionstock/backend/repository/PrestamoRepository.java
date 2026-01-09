package com.fuxionstock.backend.repository;

import com.fuxionstock.backend.entity.Prestamo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PrestamoRepository extends JpaRepository<Prestamo, Long> {

    // Préstamos pendientes de un deudor
    List<Prestamo> findBySocioDeudorIdUsuarioAndEstadoOrderByFechaPrestamoDesc(
            Long idDeudor,
            Prestamo.EstadoPrestamo estado
    );

    // Préstamos donde un socio es acreedor
    List<Prestamo> findBySocioAcreedorIdUsuarioAndEstadoOrderByFechaPrestamoDesc(
            Long idAcreedor,
            Prestamo.EstadoPrestamo estado
    );

    // Todos los préstamos pendientes
    List<Prestamo> findByEstadoOrderByFechaPrestamoDesc(Prestamo.EstadoPrestamo estado);

    Long countByEstado(Prestamo.EstadoPrestamo estado);
}