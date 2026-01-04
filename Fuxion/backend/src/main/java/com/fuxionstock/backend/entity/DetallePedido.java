package com.fuxionstock.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Getter // Reemplaza a @Data
@Setter // Reemplaza a @Data
@Entity
@ToString // Genera toString() pero nos deja excluir campos
@Table(name = "detalle_pedido")
public class DetallePedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    private Long idDetalle;

    @ManyToOne
    @JoinColumn(name = "id_pedido")
    @JsonIgnore       // Protege el JSON (Web)
    @ToString.Exclude // <--- ¡OBLIGATORIO! Protege la Consola (Java)
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
}