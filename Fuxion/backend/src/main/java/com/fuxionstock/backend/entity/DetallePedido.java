package com.fuxionstock.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@ToString
@Table(name = "detalle_pedido")
public class DetallePedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    private Long idDetalle;

    @ManyToOne
    @JoinColumn(name = "id_pedido")
    @JsonIgnore
    @ToString.Exclude
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "id_dueno_stock")
    private Usuario duenoStock;

    @Column(name = "cantidad_sobres")
    private Integer cantidadSobres;

    @Column(name = "cantidad_sticks")
    private Integer cantidadSticks;

    @Column(name = "es_regalo_sobre")
    private boolean esRegaloSobre; // true = caja gratis

    @Column(name = "es_regalo_stick")
    private boolean esRegaloStick; // true = sticks gratis

    // Es buena práctica guardar el precio al momento de la venta
    private BigDecimal precioUnitarioSobre;
    private BigDecimal precioUnitarioStick;
}