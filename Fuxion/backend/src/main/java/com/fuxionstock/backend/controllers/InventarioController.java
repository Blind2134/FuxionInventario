package com.fuxionstock.backend.controllers;

import com.fuxionstock.backend.dto.*;
import com.fuxionstock.backend.entity.*;
import com.fuxionstock.backend.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventario")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class InventarioController {

    @Autowired
    private InventarioRepository inventarioRepository;

    @Autowired
    private MovimientoStockRepository movimientoRepository;

    @Autowired
    private PrestamoRepository prestamoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AlmacenRepository almacenRepository;

    // ==========================================
    // 1. VER INVENTARIO GENERAL (TODOS LOS SOCIOS)
    // GET /api/inventario
    // ==========================================
    @GetMapping
    public ResponseEntity<?> obtenerInventarioGeneral() {
        try {
            List<Inventario> inventarios = inventarioRepository.findAll();

            // Agrupar por producto
            Map<Long, List<Inventario>> porProducto = inventarios.stream()
                    .collect(Collectors.groupingBy(i -> i.getProducto().getIdProducto()));

            return ResponseEntity.ok(inventarios);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error: " + e.getMessage());
        }
    }

    // ==========================================
    // 2. VER INVENTARIO DE UN SOCIO ESPECÍFICO
    // GET /api/inventario/socio/{idSocio}
    // ==========================================
    @GetMapping("/socio/{idSocio}")
    public ResponseEntity<?> obtenerInventarioPorSocio(@PathVariable Long idSocio) {
        try {
            Usuario socio = usuarioRepository.findById(idSocio)
                    .orElseThrow(() -> new RuntimeException("Socio no encontrado"));

            List<Inventario> inventarios = inventarioRepository
                    .findByDuenoIdUsuario(idSocio);

            InventarioResponseDTO response = new InventarioResponseDTO();
            response.setIdSocio(socio.getIdUsuario());
            response.setNombreSocio(socio.getNombre());

            List<ProductoInventarioDTO> productos = new ArrayList<>();
            int totalSobres = 0;
            int totalSticks = 0;

            for (Inventario inv : inventarios) {
                ProductoInventarioDTO prodDto = new ProductoInventarioDTO();
                prodDto.setIdProducto(inv.getProducto().getIdProducto());
                prodDto.setNombreProducto(inv.getProducto().getNombre());
                prodDto.setCategoria(inv.getProducto().getCategoria());
                prodDto.setCantidadSobres(inv.getCantidadSobres());
                prodDto.setCantidadSticks(inv.getCantidadSticks());
                prodDto.setSticksPorSobre(inv.getProducto().getSticksPorSobre());

                // Detectar stock bajo (menos de 1 sobre o menos de 5 sticks)
                boolean stockBajo = inv.getCantidadSobres() < 1 && inv.getCantidadSticks() < 5;
                prodDto.setStockBajo(stockBajo);

                productos.add(prodDto);
                totalSobres += inv.getCantidadSobres();
                totalSticks += inv.getCantidadSticks();
            }

            response.setProductos(productos);
            response.setTotalSobres(totalSobres);
            response.setTotalSticks(totalSticks);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error: " + e.getMessage());
        }
    }

    // ==========================================
    // 3. REGISTRAR ENTRADA DE STOCK
    // POST /api/inventario/entrada
    // (Cuando un socio te envía productos)
    // ==========================================
    @PostMapping("/entrada")
    @Transactional // <--- Agrega esto para revertir cambios si algo falla
    public ResponseEntity<?> registrarEntrada(@RequestBody RegistrarEntradaDTO dto) {
        try {
            Usuario socio = usuarioRepository.findById(dto.getIdSocio())
                    .orElseThrow(() -> new RuntimeException("Socio no encontrado"));
            Almacen almacen = almacenRepository.findById(dto.getIdAlmacen())
                    .orElseThrow(() -> new RuntimeException("Almacén no encontrado"));

            for (ProductoEntradaDTO prodDto : dto.getProductos()) {
                Producto producto = productoRepository.findById(prodDto.getIdProducto())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + prodDto.getIdProducto()));

                Inventario inv = inventarioRepository
                        .findByDuenoIdUsuarioAndProductoIdProducto(socio.getIdUsuario(), producto.getIdProducto())
                        .orElse(new Inventario());

                if (inv.getIdInventario() == null) {
                    inv.setAlmacen(almacen);
                    inv.setDueno(socio);
                    inv.setProducto(producto);
                    inv.setCantidadSobres(0);
                    inv.setCantidadSticks(0);
                }

                inv.setCantidadSobres(inv.getCantidadSobres() + prodDto.getCantidadSobres());
                inv.setCantidadSticks(inv.getCantidadSticks() + prodDto.getCantidadSticks());
                inventarioRepository.save(inv);

                // Registrar Movimiento de SOBRES
                if (prodDto.getCantidadSobres() > 0) {
                    registrarMovimiento(almacen, socio, producto, MovimientoStock.TipoMovimiento.ENTRADA,
                            MovimientoStock.UnidadMedida.SOBRE_CERRADO, prodDto.getCantidadSobres(),
                            "ENVIO", dto.getObservacion());
                }

                // Registrar Movimiento de STICKS
                if (prodDto.getCantidadSticks() > 0) {
                    registrarMovimiento(almacen, socio, producto, MovimientoStock.TipoMovimiento.ENTRADA,
                            MovimientoStock.UnidadMedida.STICK_SUELTO, prodDto.getCantidadSticks(),
                            "ENVIO", dto.getObservacion());
                }
            }
            return ResponseEntity.ok("Entrada registrada correctamente");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // ==========================================
    // 4. ABRIR SOBRE (CORREGIDO)
    // ==========================================
    @PostMapping("/abrir-sobre")
    @Transactional // <--- Vital aquí
    public ResponseEntity<?> abrirSobre(@RequestBody AbrirSobreDTO dto) {
        try {
            Usuario socio = usuarioRepository.findById(dto.getIdSocio())
                    .orElseThrow(() -> new RuntimeException("Socio no encontrado"));
            Producto producto = productoRepository.findById(dto.getIdProducto())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
            Almacen almacen = almacenRepository.findById(dto.getIdAlmacen())
                    .orElseThrow(() -> new RuntimeException("Almacén no encontrado"));

            Inventario inv = inventarioRepository
                    .findByDuenoIdUsuarioAndProductoIdProducto(socio.getIdUsuario(), producto.getIdProducto())
                    .orElseThrow(() -> new RuntimeException("El socio no tiene este producto"));

            if (inv.getCantidadSobres() < dto.getCantidadSobres()) {
                return ResponseEntity.badRequest().body("No hay suficientes sobres.");
            }

            int sticksGenerados = producto.getSticksPorSobre() * dto.getCantidadSobres();

            // Actualizar stock
            inv.setCantidadSobres(inv.getCantidadSobres() - dto.getCantidadSobres());
            inv.setCantidadSticks(inv.getCantidadSticks() + sticksGenerados);
            inventarioRepository.save(inv);

            // 1. Registrar SALIDA de Sobres
            registrarMovimiento(almacen, socio, producto, MovimientoStock.TipoMovimiento.APERTURA_SOBRE,
                    MovimientoStock.UnidadMedida.SOBRE_CERRADO, -dto.getCantidadSobres(),
                    "APERTURA", "Se abrieron " + dto.getCantidadSobres() + " sobres");

            // 2. Registrar ENTRADA de Sticks (FALTABA ESTO)
            registrarMovimiento(almacen, socio, producto, MovimientoStock.TipoMovimiento.APERTURA_SOBRE,
                    MovimientoStock.UnidadMedida.STICK_SUELTO, sticksGenerados,
                    "APERTURA", "Generados por apertura de sobres");

            return ResponseEntity.ok(Map.of(
                    "mensaje", "Apertura realizada",
                    "sticksGenerados", sticksGenerados,
                    "nuevoStockSobres", inv.getCantidadSobres(),
                    "nuevoStockSticks", inv.getCantidadSticks()
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // Método auxiliar para limpiar el código repetitivo
    private void registrarMovimiento(Almacen al, Usuario us, Producto pr, MovimientoStock.TipoMovimiento tipo,
                                     MovimientoStock.UnidadMedida unidad, int cant, String ref, String obs) {
        MovimientoStock m = new MovimientoStock();
        m.setAlmacen(al);
        m.setDueno(us);
        m.setProducto(pr);
        m.setTipo(tipo);
        m.setUnidadMedida(unidad);
        m.setCantidad(cant);
        m.setReferenciaTipo(ref);
        m.setObservacion(obs);
        // Asumiendo que tienes un campo fecha o @PrePersist en la entidad
        m.setFecha(java.time.LocalDateTime.now());
        movimientoRepository.save(m);
    }

    // ==========================================
    // 5. HISTORIAL DE MOVIMIENTOS
    // GET /api/inventario/movimientos/socio/{idSocio}
    // ==========================================
    @GetMapping("/movimientos/socio/{idSocio}")
    public ResponseEntity<?> obtenerMovimientosPorSocio(@PathVariable Long idSocio) {
        try {
            List<MovimientoStock> movimientos = movimientoRepository
                    .findByDuenoIdUsuarioOrderByFechaDesc(idSocio);

            List<MovimientoStockDTO> response = movimientos.stream()
                    .map(this::mapToMovimientoDTO)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error: " + e.getMessage());
        }
    }

    // ==========================================
    // MÉTODO AUXILIAR: Mapear MovimientoStock a DTO
    // ==========================================
    private MovimientoStockDTO mapToMovimientoDTO(MovimientoStock mov) {
        MovimientoStockDTO dto = new MovimientoStockDTO();
        dto.setIdMovimiento(mov.getIdMovimiento());
        dto.setFecha(mov.getFecha());
        dto.setTipo(mov.getTipo().name());
        dto.setUnidadMedida(mov.getUnidadMedida().name());
        dto.setCantidad(mov.getCantidad());
        dto.setNombreProducto(mov.getProducto().getNombre());
        dto.setNombreSocio(mov.getDueno().getNombre());
        dto.setObservacion(mov.getObservacion());
        return dto;
    }
}