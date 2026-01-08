package com.fuxionstock.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Setter
@Getter
@ToString
@Entity
@Table(name = "productos" )
@Builder
@NoArgsConstructor          // ✅ OBLIGATORIO PARA JPA
@AllArgsConstructor         // ✅ OBLIGATORIO PARA @Builder
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Long idProducto;

    @Column(nullable = false, length = 50 )
    private String nombre;


    private String categoria;

    private String sku;

    @Column (name = "img_url")
    private String imgUrl;

    @Column(name = "sticks_por_sobre")
    private Integer sticksPorSobre;
    @Column(name = "precio_referencial" )
    private BigDecimal precioReferencial;

    @Column (name = "estado")
    private String estado ;



}
