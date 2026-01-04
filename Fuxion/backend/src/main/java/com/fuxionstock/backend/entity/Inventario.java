package com.fuxionstock.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Entity
@Table(name = "inventario")
public class Inventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inventario")
    private  Long idInventario;

    @ManyToOne
    @JoinColumn(name = "id_almacen", nullable = false)
    @ToString.Exclude
    private Almacen almacen;

    @ManyToOne
    @JoinColumn(name = "id_dueno", nullable = false)
    @ToString.Exclude
    private Usuario dueno;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    @ToString.Exclude
    private Producto producto;

    @Column(name = "cantidad_sobres")
    private Integer cantidadSobres = 0;

    @Column (name = "cantidad_sticks")
    private Integer cantidadSticks = 0;



}
