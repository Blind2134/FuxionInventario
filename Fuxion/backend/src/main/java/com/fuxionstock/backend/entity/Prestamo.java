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

    @Column(name = "fecha_prestamo") // Agregué _prestamo para ser explícito
    private LocalDateTime fechaPrestamo = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "id_pedido_origen")
    private Pedido pedidoOrigen;

    @ManyToOne
    @JoinColumn(name = "id_socio_deudor")
    private Usuario socioDeudor; // El vendedor que pidió prestado (El que debe)

    @ManyToOne
    @JoinColumn(name = "id_socio_acreedor")
    private Usuario socioAcreedor; // El dueño del stock (Al que le deben)

    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto producto;



    @Column(name = "cantidad_sobres") // Agregué Sobres
    private Integer cantidadSobres;

    @Column(name = "cantidad_sticks")
    private Integer cantidadSticks;

    @ManyToOne
    @JoinColumn(name = "id_almacen")
    private Almacen almacen;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoPrestamo estado = EstadoPrestamo.PENDIENTE;

    public enum EstadoPrestamo {
        PENDIENTE, PAGADO
    }
}