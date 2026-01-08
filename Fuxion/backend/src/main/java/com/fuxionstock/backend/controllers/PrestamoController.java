package com.fuxionstock.backend.controllers;

import com.fuxionstock.backend.dto.CrearPrestamoDTO;
import com.fuxionstock.backend.dto.PrestamoResponseDTO;
import com.fuxionstock.backend.entity.*;
import com.fuxionstock.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/prestamos")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class PrestamoController {

    @Autowired
    private PrestamoRepository prestamoRepository;

    @Autowired
    private InventarioRepository inventarioRepository;

    @Autowired
    private MovimientoStockRepository movimientoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private AlmacenRepository almacenRepository;

    // ==========================================
    // 1. LISTAR TODOS LOS PRÉSTAMOS
    // GET /api/prestamos
    // ==========================================
    @GetMapping
    public ResponseEntity<?> obtenerTodos() {
        try {
            List<Prestamo> prestamos = prestamoRepository.findAll();
            List<PrestamoResponseDTO> response = new ArrayList<>();

            for (Prestamo p : prestamos) {
                response.add(mapToPrestamoDTO(p));
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error: " + e.getMessage());
        }
    }

    // ==========================================
    // 2. LISTAR PRÉSTAMOS PENDIENTES
    // GET /api/prestamos/pendientes
    // ==========================================
    @GetMapping("/pendientes")
    public ResponseEntity<?> obtenerPendientes() {
        try {
            List<Prestamo> prestamos = prestamoRepository
                    .findByEstadoOrderByFechaDesc(Prestamo.EstadoPrestamo.PENDIENTE);

            List<PrestamoResponseDTO> response = new ArrayList<>();
            for (Prestamo p : prestamos) {
                response.add(mapToPrestamoDTO(p));
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error: " + e.getMessage());
        }
    }

    // ==========================================
    // 3. PRÉSTAMOS DE UN DEUDOR (quien debe)
    // GET /api/prestamos/deudor/{idSocio}
    // ==========================================
    @GetMapping("/deudor/{idSocio}")
    public ResponseEntity<?> obtenerPorDeudor(@PathVariable Long idSocio) {
        try {
            List<Prestamo> prestamos = prestamoRepository
                    .findBySocioDeudorIdUsuarioAndEstadoOrderByFechaDesc(
                            idSocio,
                            Prestamo.EstadoPrestamo.PENDIENTE
                    );

            List<PrestamoResponseDTO> response = new ArrayList<>();
            for (Prestamo p : prestamos) {
                response.add(mapToPrestamoDTO(p));
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error: " + e.getMessage());
        }
    }

    // ==========================================
    // 4. PRÉSTAMOS DE UN ACREEDOR (quien prestó)
    // GET /api/prestamos/acreedor/{idSocio}
    // ==========================================
    @GetMapping("/acreedor/{idSocio}")
    public ResponseEntity<?> obtenerPorAcreedor(@PathVariable Long idSocio) {
        try {
            List<Prestamo> prestamos = prestamoRepository
                    .findBySocioAcreedorIdUsuarioAndEstadoOrderByFechaDesc(
                            idSocio,
                            Prestamo.EstadoPrestamo.PENDIENTE
                    );

            List<PrestamoResponseDTO> response = new ArrayList<>();
            for (Prestamo p : prestamos) {
                response.add(mapToPrestamoDTO(p));
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error: " + e.getMessage());
        }
    }

    // ==========================================
    // 5. CREAR PRÉSTAMO
    // POST /api/prestamos
    // ==========================================
    @PostMapping
    public ResponseEntity<?> crearPrestamo(@RequestBody CrearPrestamoDTO dto) {
        try {
            // Validaciones
            Usuario deudor = usuarioRepository.findById(dto.getIdSocioDeudor())
                    .orElseThrow(() -> new RuntimeException("Deudor no encontrado"));

            Usuario acreedor = usuarioRepository.findById(dto.getIdSocioAcreedor())
                    .orElseThrow(() -> new RuntimeException("Acreedor no encontrado"));

            Producto producto = productoRepository.findById(dto.getIdProducto())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            Almacen almacen = almacenRepository.findById(dto.getIdAlmacen())
                    .orElseThrow(() -> new RuntimeException("Almacén no encontrado"));

            // Verificar que el acreedor tiene stock suficiente
            Inventario invAcreedor = inventarioRepository
                    .findByDuenoIdUsuarioAndProductoIdProducto(
                            acreedor.getIdUsuario(),
                            producto.getIdProducto()
                    )
                    .orElseThrow(() -> new RuntimeException("El acreedor no tiene este producto"));

            if (invAcreedor.getCantidadSticks() < dto.getCantidadSticks()) {
                return ResponseEntity.badRequest()
                        .body("El acreedor no tiene suficientes sticks. Disponibles: "
                                + invAcreedor.getCantidadSticks());
            }

            // Restar del inventario del acreedor
            invAcreedor.setCantidadSticks(invAcreedor.getCantidadSticks() - dto.getCantidadSticks());
            inventarioRepository.save(invAcreedor);

            // Sumar al inventario del deudor
            Inventario invDeudor = inventarioRepository
                    .findByDuenoIdUsuarioAndProductoIdProducto(
                            deudor.getIdUsuario(),
                            producto.getIdProducto()
                    )
                    .orElse(new Inventario());

            if (invDeudor.getIdInventario() == null) {
                invDeudor.setAlmacen(almacen);
                invDeudor.setDueno(deudor);
                invDeudor.setProducto(producto);
                invDeudor.setCantidadSobres(0);
                invDeudor.setCantidadSticks(0);
            }

            invDeudor.setCantidadSticks(invDeudor.getCantidadSticks() + dto.getCantidadSticks());
            inventarioRepository.save(invDeudor);

            // Registrar el préstamo
            Prestamo prestamo = new Prestamo();
            prestamo.setAlmacen(almacen);
            prestamo.setSocioDeudor(deudor);
            prestamo.setSocioAcreedor(acreedor);
            prestamo.setProducto(producto);
            prestamo.setCantidadSticks(dto.getCantidadSticks());
            prestamo.setEstado(Prestamo.EstadoPrestamo.PENDIENTE);

            Prestamo prestamoGuardado = prestamoRepository.save(prestamo);

            // Registrar movimientos
            // Movimiento de salida del acreedor
            MovimientoStock movSalida = new MovimientoStock();
            movSalida.setAlmacen(almacen);
            movSalida.setProducto(producto);
            movSalida.setDueno(acreedor);
            movSalida.setTipo(MovimientoStock.TipoMovimiento.PRESTAMO);
            movSalida.setUnidadMedida(MovimientoStock.UnidadMedida.STICK_SUELTO);
            movSalida.setCantidad(-dto.getCantidadSticks()); // Negativo
            movSalida.setReferenciaTipo("PRESTAMO");
            movSalida.setReferenciaId(prestamoGuardado.getIdPrestamo());
            movSalida.setObservacion("Préstamo a " + deudor.getNombre() + ": " + dto.getObservacion());
            movimientoRepository.save(movSalida);

            // Movimiento de entrada del deudor
            MovimientoStock movEntrada = new MovimientoStock();
            movEntrada.setAlmacen(almacen);
            movEntrada.setProducto(producto);
            movEntrada.setDueno(deudor);
            movEntrada.setTipo(MovimientoStock.TipoMovimiento.PRESTAMO);
            movEntrada.setUnidadMedida(MovimientoStock.UnidadMedida.STICK_SUELTO);
            movEntrada.setCantidad(dto.getCantidadSticks()); // Positivo
            movEntrada.setReferenciaTipo("PRESTAMO");
            movEntrada.setReferenciaId(prestamoGuardado.getIdPrestamo());
            movEntrada.setObservacion("Préstamo de " + acreedor.getNombre() + ": " + dto.getObservacion());
            movimientoRepository.save(movEntrada);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(mapToPrestamoDTO(prestamoGuardado));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error: " + e.getMessage());
        }
    }

    // ==========================================
    // 6. MARCAR PRÉSTAMO COMO PAGADO/DEVUELTO
    // PUT /api/prestamos/{id}/pagar
    // ==========================================
    @PutMapping("/{id}/pagar")
    public ResponseEntity<?> pagarPrestamo(@PathVariable Long id) {
        try {
            Prestamo prestamo = prestamoRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));

            if (prestamo.getEstado() == Prestamo.EstadoPrestamo.PAGADO) {
                return ResponseEntity.badRequest()
                        .body("Este préstamo ya fue pagado");
            }

            // Marcar como pagado
            prestamo.setEstado(Prestamo.EstadoPrestamo.PAGADO);
            prestamoRepository.save(prestamo);

            return ResponseEntity.ok(mapToPrestamoDTO(prestamo));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error: " + e.getMessage());
        }
    }

    // ==========================================
    // MÉTODO AUXILIAR: Mapear Prestamo a DTO
    // ==========================================
    private PrestamoResponseDTO mapToPrestamoDTO(Prestamo p) {
        PrestamoResponseDTO dto = new PrestamoResponseDTO();
        dto.setIdPrestamo(p.getIdPrestamo());
        dto.setFecha(p.getFecha());
        dto.setEstado(p.getEstado().name());

        dto.setIdSocioDeudor(p.getSocioDeudor().getIdUsuario());
        dto.setNombreSocioDeudor(p.getSocioDeudor().getNombre());

        dto.setIdSocioAcreedor(p.getSocioAcreedor().getIdUsuario());
        dto.setNombreSocioAcreedor(p.getSocioAcreedor().getNombre());

        dto.setIdProducto(p.getProducto().getIdProducto());
        dto.setNombreProducto(p.getProducto().getNombre());
        dto.setCantidadSticks(p.getCantidadSticks());

        if (p.getPedidoOrigen() != null) {
            dto.setIdPedido(p.getPedidoOrigen().getIdPedido());
            dto.setCodigoPedido(p.getPedidoOrigen().getCodigoPedido());
        }

        return dto;
    }
}