package com.fuxionstock.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@Entity
@Table(name = "prestamos")
public class Prestamo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_prestamo")
    private Long idPrestamo;

    @Column(name = "fecha")
    private LocalDateTime fecha = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "id_pedido_origen")
    private Pedido pedidoOrigen;

    @ManyToOne
    @JoinColumn(name = "id_almacen")
    private Almacen almacen;

    @ManyToOne
    @JoinColumn(name = "id_socio_deudor")
    private Usuario socioDeudor; // El que NO tenía stock

    @ManyToOne
    @JoinColumn(name = "id_socio_acreedor")
    private Usuario socioAcreedor; // El que PRESTÓ

    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto producto;

    @Column(name = "cantidad_sticks")
    private Integer cantidadSticks;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoPrestamo estado = EstadoPrestamo.PENDIENTE;

    public enum EstadoPrestamo {
        PENDIENTE, PAGADO
    }
}