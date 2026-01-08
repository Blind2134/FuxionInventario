package com.fuxionstock.backend.repository;

import com.fuxionstock.backend.entity.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventarioRepository extends JpaRepository<Inventario, Long> {

    Optional<Inventario> findByDuenoIdUsuarioAndProductoIdProducto(Long idDueno, Long idProducto);
    List<Inventario> findByDuenoIdUsuario(Long idDueno);
}
