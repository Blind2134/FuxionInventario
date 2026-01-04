package com.fuxionstock.backend.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Entity
@ToString
@Table (name =  "almacenes")
public class Almacen {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_almacen")
    private Long idAlmacen;

    @Column(nullable = false)
    private String nombre;

    private String direccion;

    private String ciudad;


    @ManyToOne
    @JoinColumn(name = "id_encargado")
    @ToString.Exclude
    private Usuario encargado;




}
