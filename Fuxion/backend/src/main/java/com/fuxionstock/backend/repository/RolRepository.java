package com.fuxionstock.backend.repository;

import com.fuxionstock.backend.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolRepository extends JpaRepository<Rol, Long> {

    // Buscar rol por nombre (útil para validaciones)
    Rol findByNombre(String nombre);
}
