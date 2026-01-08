package com.fuxionstock.backend.dto;

import lombok.Data;

@Data
public class ActualizarUsuarioDTO {

    private String nombre;
    private String email;
    private String telefono;
    private Long idRol;
    private Boolean activo;

    // Nota: NO incluimos password aquí
    // El cambio de contraseña será un endpoint separado por seguridad
}