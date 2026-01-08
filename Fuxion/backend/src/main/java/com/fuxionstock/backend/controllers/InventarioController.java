package com.fuxionstock.backend.controllers;

import com.fuxionstock.backend.dto.*;
import com.fuxionstock.backend.entity.*;
import com.fuxionstock.backend.repository.*;
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
    public ResponseEntity<?> registrarEntrada(@RequestBody RegistrarEntradaDTO dto) {
        try {
            Usuario socio = usuarioRepository.findById(dto.getIdSocio())
                    .orElseThrow(() -> new RuntimeException("Socio no encontrado"));

            Almacen almacen = almacenRepository.findById(dto.getIdAlmacen())
                    .orElseThrow(() -> new RuntimeException("Almacén no encontrado"));

            // Procesar cada producto
            for (ProductoEntradaDTO prodDto : dto.getProductos()) {
                Producto producto = productoRepository.findById(prodDto.getIdProducto())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + prodDto.getIdProducto()));

                // Buscar o crear inventario
                Inventario inv = inventarioRepository
                        .findByDuenoIdUsuarioAndProductoIdProducto(
                                socio.getIdUsuario(),
                                producto.getIdProducto()
                        )
                        .orElse(new Inventario());

                // Si es nuevo
                if (inv.getIdInventario() == null) {
                    inv.setAlmacen(almacen);
                    inv.setDueno(socio);
                    inv.setProducto(producto);
                    inv.setCantidadSobres(0);
                    inv.setCantidadSticks(0);
                }

                // Sumar stock
                inv.setCantidadSobres(inv.getCantidadSobres() + prodDto.getCantidadSobres());
                inv.setCantidadSticks(inv.getCantidadSticks() + prodDto.getCantidadSticks());

                inventarioRepository.save(inv);

                // Registrar movimiento
                MovimientoStock movimiento = new MovimientoStock();
                movimiento.setAlmacen(almacen);
                movimiento.setProducto(producto);
                movimiento.setDueno(socio);
                movimiento.setTipo(MovimientoStock.TipoMovimiento.ENTRADA);
                movimiento.setReferenciaTipo("ENVIO");
                movimiento.setObservacion(dto.getObservacion());

                if (prodDto.getCantidadSobres() > 0) {
                    movimiento.setUnidadMedida(MovimientoStock.UnidadMedida.SOBRE_CERRADO);
                    movimiento.setCantidad(prodDto.getCantidadSobres());
                    movimientoRepository.save(movimiento);
                }

                if (prodDto.getCantidadSticks() > 0) {
                    MovimientoStock movSticks = new MovimientoStock();
                    movSticks.setAlmacen(almacen);
                    movSticks.setProducto(producto);
                    movSticks.setDueno(socio);
                    movSticks.setTipo(MovimientoStock.TipoMovimiento.ENTRADA);
                    movSticks.setUnidadMedida(MovimientoStock.UnidadMedida.STICK_SUELTO);
                    movSticks.setCantidad(prodDto.getCantidadSticks());
                    movSticks.setReferenciaTipo("ENVIO");
                    movSticks.setObservacion(dto.getObservacion());
                    movimientoRepository.save(movSticks);
                }
            }

            return ResponseEntity.ok("Entrada registrada correctamente");

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error: " + e.getMessage());
        }
    }

    // ==========================================
    // 4. ABRIR SOBRE (Convertir sobres en sticks)
    // POST /api/inventario/abrir-sobre
    // ==========================================
    @PostMapping("/abrir-sobre")
    public ResponseEntity<?> abrirSobre(@RequestBody AbrirSobreDTO dto) {
        try {
            Usuario socio = usuarioRepository.findById(dto.getIdSocio())
                    .orElseThrow(() -> new RuntimeException("Socio no encontrado"));

            Producto producto = productoRepository.findById(dto.getIdProducto())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            Almacen almacen = almacenRepository.findById(dto.getIdAlmacen())
                    .orElseThrow(() -> new RuntimeException("Almacén no encontrado"));

            Inventario inv = inventarioRepository
                    .findByDuenoIdUsuarioAndProductoIdProducto(
                            socio.getIdUsuario(),
                            producto.getIdProducto()
                    )
                    .orElseThrow(() -> new RuntimeException("El socio no tiene este producto en inventario"));

            // Validar que tenga suficientes sobres
            if (inv.getCantidadSobres() < dto.getCantidadSobres()) {
                return ResponseEntity.badRequest()
                        .body("No tiene suficientes sobres. Disponibles: " + inv.getCantidadSobres());
            }

            // Calcular sticks
            int sticksGenerados = producto.getSticksPorSobre() * dto.getCantidadSobres();

            // Actualizar inventario
            inv.setCantidadSobres(inv.getCantidadSobres() - dto.getCantidadSobres());
            inv.setCantidadSticks(inv.getCantidadSticks() + sticksGenerados);

            inventarioRepository.save(inv);

            // Registrar movimiento
            MovimientoStock movimiento = new MovimientoStock();
            movimiento.setAlmacen(almacen);
            movimiento.setProducto(producto);
            movimiento.setDueno(socio);
            movimiento.setTipo(MovimientoStock.TipoMovimiento.APERTURA_SOBRE);
            movimiento.setUnidadMedida(MovimientoStock.UnidadMedida.SOBRE_CERRADO);
            movimiento.setCantidad(-dto.getCantidadSobres()); // Negativo porque se resta
            movimiento.setObservacion("Abiertos " + dto.getCantidadSobres() + " sobres, generando " + sticksGenerados + " sticks");

            movimientoRepository.save(movimiento);

            return ResponseEntity.ok(Map.of(
                    "mensaje", "Sobre(s) abierto(s) correctamente",
                    "sobresAbiertos", dto.getCantidadSobres(),
                    "sticksGenerados", sticksGenerados,
                    "nuevoStockSobres", inv.getCantidadSobres(),
                    "nuevoStockSticks", inv.getCantidadSticks()
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error: " + e.getMessage());
        }
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