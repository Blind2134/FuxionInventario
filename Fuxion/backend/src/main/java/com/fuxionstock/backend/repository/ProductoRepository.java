package com.fuxionstock.backend.repository;


import com.fuxionstock.backend.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByEstado(String estado);

    Optional<Producto> findByNombreIgnoreCase(String nombre);
}
