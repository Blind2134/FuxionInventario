package com.fuxionstock.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CrearUsuarioDTO {
    @NotBlank
    private String nombre;
    @NotNull
    private String email;
    @NotNull
    private String password;

    private String telefono;
    
    private Long idRol;



}
