package com.fuxionstock.backend.dto;

import lombok.Data;

@Data
public class CambiarPasswordDTO {

    private String passwordActual;    // Para validar que conoce la contraseña actual
    private String passwordNueva;
    private String confirmarPassword; // Debe coincidir con passwordNueva
}