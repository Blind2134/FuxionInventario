package com.fuxionstock.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UsuarioResponseDTO {

    private Long idUsuario;
    private String nombre;
    private String email;
    private String telefono;
    private Boolean activo;
    private LocalDateTime fechaRegistro;

    // Información del Rol
    private Long idRol;
    private String nombreRol;

    // IMPORTANTE: NO incluir password por seguridad

    // Estadísticas opcionales (para el perfil)
    private Integer totalProductosInventario;
    private Integer totalPedidosRealizados;
}
