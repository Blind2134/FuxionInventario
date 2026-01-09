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
                    .findByEstadoOrderByFechaPrestamoDesc(Prestamo.EstadoPrestamo.PENDIENTE);

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
                    .findBySocioDeudorIdUsuarioAndEstadoOrderByFechaPrestamoDesc(
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
                    .findBySocioAcreedorIdUsuarioAndEstadoOrderByFechaPrestamoDesc(
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
            // 0. Sanitizar cantidades (evitar nulos)
            int cantSobres = dto.getCantidadSobres() != null ? dto.getCantidadSobres() : 0;
            int cantSticks = dto.getCantidadSticks() != null ? dto.getCantidadSticks() : 0;

            if (cantSobres == 0 && cantSticks == 0) {
                return ResponseEntity.badRequest().body("Debes prestar al menos un sobre o un stick.");
            }

            // 1. Validaciones de existencia
            Usuario deudor = usuarioRepository.findById(dto.getIdSocioDeudor())
                    .orElseThrow(() -> new RuntimeException("Deudor no encontrado"));

            Usuario acreedor = usuarioRepository.findById(dto.getIdSocioAcreedor())
                    .orElseThrow(() -> new RuntimeException("Acreedor no encontrado"));

            Producto producto = productoRepository.findById(dto.getIdProducto())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            Almacen almacen = almacenRepository.findById(dto.getIdAlmacen())
                    .orElseThrow(() -> new RuntimeException("Almacén no encontrado"));

            // 2. Verificar que el acreedor tiene stock suficiente de AMBOS
            Inventario invAcreedor = inventarioRepository
                    .findByDuenoIdUsuarioAndProductoIdProducto(
                            acreedor.getIdUsuario(),
                            producto.getIdProducto()
                    )
                    .orElseThrow(() -> new RuntimeException("El acreedor no tiene este producto en inventario"));

            // Validar Sobres
            if (invAcreedor.getCantidadSobres() < cantSobres) {
                return ResponseEntity.badRequest()
                        .body("El acreedor no tiene suficientes SOBRES. Disponibles: "
                                + invAcreedor.getCantidadSobres());
            }
            // Validar Sticks
            if (invAcreedor.getCantidadSticks() < cantSticks) {
                return ResponseEntity.badRequest()
                        .body("El acreedor no tiene suficientes STICKS. Disponibles: "
                                + invAcreedor.getCantidadSticks());
            }

            // 3. Restar del inventario del acreedor (Salida)
            invAcreedor.setCantidadSobres(invAcreedor.getCantidadSobres() - cantSobres);
            invAcreedor.setCantidadSticks(invAcreedor.getCantidadSticks() - cantSticks);
            invAcreedor.calcularStockBajo();
            inventarioRepository.save(invAcreedor);

            // 4. Sumar al inventario del deudor (Entrada)
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

            invDeudor.setCantidadSobres(invDeudor.getCantidadSobres() + cantSobres);
            invDeudor.setCantidadSticks(invDeudor.getCantidadSticks() + cantSticks);
            invAcreedor.calcularStockBajo();
            inventarioRepository.save(invDeudor);

            // 5. Registrar la entidad PRESTAMO
            Prestamo prestamo = new Prestamo();
            prestamo.setAlmacen(almacen);
            prestamo.setSocioDeudor(deudor);
            prestamo.setSocioAcreedor(acreedor);
            prestamo.setProducto(producto);

            // Guardamos ambos datos
            prestamo.setCantidadSobres(cantSobres);
            prestamo.setCantidadSticks(cantSticks);

            prestamo.setEstado(Prestamo.EstadoPrestamo.PENDIENTE);
            Prestamo prestamoGuardado = prestamoRepository.save(prestamo);

            // 6. Registrar MOVIMIENTOS (Kardex)
            // Aquí generamos movimientos separados si es necesario para Sobres y Sticks
            // para mantener la trazabilidad exacta.

            // --- Movimientos de SOBRES (si hubo) ---
            if (cantSobres > 0) {
                // Salida Acreedor
                crearMovimiento(almacen, producto, acreedor, MovimientoStock.TipoMovimiento.PRESTAMO,
                        MovimientoStock.UnidadMedida.SOBRE_CERRADO, // O usa SOBRE si tienes ese enum
                        -cantSobres, prestamoGuardado, "Préstamo (Sobres) a " + deudor.getNombre(), dto.getObservacion());

                // Entrada Deudor
                crearMovimiento(almacen, producto, deudor, MovimientoStock.TipoMovimiento.PRESTAMO,
                        MovimientoStock.UnidadMedida.SOBRE_CERRADO, // O usa SOBRE
                        cantSobres, prestamoGuardado, "Préstamo (Sobres) de " + acreedor.getNombre(), dto.getObservacion());
            }

            // --- Movimientos de STICKS (si hubo) ---
            if (cantSticks > 0) {
                // Salida Acreedor
                crearMovimiento(almacen, producto, acreedor, MovimientoStock.TipoMovimiento.PRESTAMO,
                        MovimientoStock.UnidadMedida.STICK_SUELTO,
                        -cantSticks, prestamoGuardado, "Préstamo (Sticks) a " + deudor.getNombre(), dto.getObservacion());

                // Entrada Deudor
                crearMovimiento(almacen, producto, deudor, MovimientoStock.TipoMovimiento.PRESTAMO,
                        MovimientoStock.UnidadMedida.STICK_SUELTO,
                        cantSticks, prestamoGuardado, "Préstamo (Sticks) de " + acreedor.getNombre(), dto.getObservacion());
            }

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(mapToPrestamoDTO(prestamoGuardado));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("Error: " + e.getMessage());
        }
    }

    // Método auxiliar para no repetir código en los movimientos
    private void crearMovimiento(Almacen alm, Producto prod, Usuario dueno,
                                 MovimientoStock.TipoMovimiento tipo,
                                 MovimientoStock.UnidadMedida unidad,
                                 int cantidad, Prestamo ref, String obsSistema, String obsUsuario) {
        MovimientoStock mov = new MovimientoStock();
        mov.setAlmacen(alm);
        mov.setProducto(prod);
        mov.setDueno(dueno);
        mov.setTipo(tipo);
        mov.setUnidadMedida(unidad);
        mov.setCantidad(cantidad);
        mov.setReferenciaTipo("PRESTAMO");
        mov.setReferenciaId(ref.getIdPrestamo());
        mov.setObservacion(obsSistema + (obsUsuario != null ? " | " + obsUsuario : ""));
        movimientoRepository.save(mov);
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
        dto.setFecha(p.getFechaPrestamo());
        dto.setEstado(p.getEstado().name());

        dto.setIdSocioDeudor(p.getSocioDeudor().getIdUsuario());
        dto.setNombreSocioDeudor(p.getSocioDeudor().getNombre());

        dto.setIdSocioAcreedor(p.getSocioAcreedor().getIdUsuario());
        dto.setNombreSocioAcreedor(p.getSocioAcreedor().getNombre());

        dto.setIdProducto(p.getProducto().getIdProducto());
        dto.setNombreProducto(p.getProducto().getNombre());

        // AHORA MAPEAMOS AMBOS
        dto.setCantidadSobres(p.getCantidadSobres());
        dto.setCantidadSticks(p.getCantidadSticks());

        if (p.getPedidoOrigen() != null) {
            dto.setIdPedido(p.getPedidoOrigen().getIdPedido());
            dto.setCodigoPedido(p.getPedidoOrigen().getCodigoPedido());
        }

        return dto;
    }
}