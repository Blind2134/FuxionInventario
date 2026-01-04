package com.fuxionstock.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;


@Getter
@Setter
@Entity
@ToString
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name = "id_usuario")
    private Long idUsuario;

    @Column (nullable = false, length = 50 )
    private String nombre;

    @Column (nullable = false, length = 75 )
    private String email;


    private String password;

    private  String telefono;

    private Boolean activo = true;

    @Column (name = "fecha_registro")
    private LocalDateTime fechaRegistro = LocalDateTime.now();


    @ManyToOne
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;
}
