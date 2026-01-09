package com.fuxionstock.backend.repository;

import com.fuxionstock.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Método que ya tienes
    Usuario findByEmail(String email);

    // NUEVOS MÉTODOS - Agregar estos:

    // Obtener solo usuarios activos
    List<Usuario> findByActivoTrue();

    // Obtener usuarios por rol
    List<Usuario> findByRolIdRol(Long idRol);

    // Obtener usuarios activos por rol
    List<Usuario> findByRolIdRolAndActivoTrue(Long idRol);

    // Buscar por nombre (útil para búsqueda)
    List<Usuario> findByNombreContainingIgnoreCase(String nombre);

    Long countByActivoTrue();
}
