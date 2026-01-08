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
@Table(name = "movimientos_stock")
public class MovimientoStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_movimiento")
    private Long idMovimiento;

    @Column(name = "fecha")
    private LocalDateTime fecha = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "id_almacen")
    private Almacen almacen;

    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "id_dueno")
    private Usuario dueno;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private TipoMovimiento tipo;

    @Enumerated(EnumType.STRING)
    @Column(name = "unidad_medida")
    private UnidadMedida unidadMedida;

    @Column(name = "cantidad")
    private Integer cantidad; // Positivo = suma, Negativo = resta

    @Column(name = "referencia_tipo")
    private String referenciaTipo; // "PEDIDO", "ENVIO", "PRESTAMO"

    @Column(name = "referencia_id")
    private Long referenciaId;

    @Column(name = "observacion", columnDefinition = "TEXT")
    private String observacion;

    // Enums
    public enum TipoMovimiento {
        ENTRADA, SALIDA, PRESTAMO, AJUSTE_INCIDENCIA, APERTURA_SOBRE
    }

    public enum UnidadMedida {
        SOBRE_CERRADO, STICK_SUELTO
    }
}
