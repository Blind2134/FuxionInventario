package com.fuxionstock.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@ToString
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private Long idPedido;

    @Column(name = "codigo_pedido", unique = true)
    private String codigoPedido; // Ej: PED-1001

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    // RELACIONES
    @ManyToOne
    @JoinColumn(name = "id_almacen")
    private Almacen almacen; // Asegúrate de tener la entidad Almacen creada (aunque sea básica)

    @ManyToOne
    @JoinColumn(name = "id_vendedor")
    private Usuario vendedor; // El socio que vende

    // DATOS CLIENTE FINAL
    @Column(name = "cliente_nombre")
    private String clienteNombre;
    @Column (name = "cliente_telefono")
    private String clienteTelefono;
    @Column (name = "cliente_direccion")
    private String clienteDireccion;

    @Column(name = "nombre_motorizado")
    private String nombreMotorizado;

    @Enumerated(EnumType.STRING)
    private EstadoPedido estado; // PENDIENTE, ENTREGADO_MOTORIZADO, CANCELADO

    // DINERO
    @Column(name = "monto_total_venta")
    private BigDecimal montoTotalVenta;

    @Column(name = "comision_almacenero")
    private BigDecimal comisionAlmacenero; // TU GANANCIA 💰

    // Lista de productos dentro del pedido

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<DetallePedido> detalles = new ArrayList<>();

    // Enum interno para estado
    public enum EstadoPedido {
        PENDIENTE, EMPAQUETADO, ENTREGADO_MOTORIZADO, CANCELADO
    }
}