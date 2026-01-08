package com.fuxionstock.backend.repository;

import com.fuxionstock.backend.entity.Prestamo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PrestamoRepository extends JpaRepository<Prestamo, Long> {

    // Préstamos pendientes de un deudor
    List<Prestamo> findBySocioDeudorIdUsuarioAndEstadoOrderByFechaDesc(
            Long idDeudor,
            Prestamo.EstadoPrestamo estado
    );

    // Préstamos donde un socio es acreedor
    List<Prestamo> findBySocioAcreedorIdUsuarioAndEstadoOrderByFechaDesc(
            Long idAcreedor,
            Prestamo.EstadoPrestamo estado
    );

    // Todos los préstamos pendientes
    List<Prestamo> findByEstadoOrderByFechaDesc(Prestamo.EstadoPrestamo estado);
}