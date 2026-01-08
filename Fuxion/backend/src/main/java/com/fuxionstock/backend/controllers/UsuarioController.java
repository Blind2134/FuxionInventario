package com.fuxionstock.backend.controllers;

import com.fuxionstock.backend.dto.ActualizarUsuarioDTO;
import com.fuxionstock.backend.dto.CrearUsuarioDTO;
import com.fuxionstock.backend.dto.UsuarioResponseDTO;
import com.fuxionstock.backend.entity.Rol;
import com.fuxionstock.backend.entity.Usuario;
import com.fuxionstock.backend.repository.RolRepository;
import com.fuxionstock.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    // Regex para validar email
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    // ==========================================
    // 1. OBTENER TODOS LOS USUARIOS (SOCIOS)
    // GET http://localhost:8080/api/usuarios
    // ==========================================
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> obtenerTodos() {
        try {
            List<Usuario> usuarios = usuarioRepository.findAll();
            List<UsuarioResponseDTO> response = new ArrayList<>();

            for (Usuario usuario : usuarios) {
                UsuarioResponseDTO dto = mapToResponseDTO(usuario);
                response.add(dto);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==========================================
    // 2. OBTENER UN USUARIO POR ID
    // GET http://localhost:8080/api/usuarios/{id}
    // ==========================================
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            Usuario usuario = usuarioRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

            UsuarioResponseDTO response = mapToResponseDTO(usuario);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error al obtener usuario: " + e.getMessage());
        }
    }

    // ==========================================
    // 3. CREAR NUEVO USUARIO (SOCIO)
    // POST http://localhost:8080/api/usuarios
    // ==========================================
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody CrearUsuarioDTO dto) {
        try {
            // Validación: Nombre obligatorio
            if (dto.getNombre() == null || dto.getNombre().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El nombre es obligatorio");
            }

            // Validación: Email obligatorio y formato válido
            if (dto.getEmail() == null || dto.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El email es obligatorio");
            }
            if (!EMAIL_PATTERN.matcher(dto.getEmail()).matches()) {
                return ResponseEntity.badRequest().body("El email no tiene un formato válido");
            }

            // Validación: Email único
            Usuario usuarioExistente = usuarioRepository.findByEmail(dto.getEmail());
            if (usuarioExistente != null) {
                return ResponseEntity.badRequest()
                        .body("Ya existe un usuario con el email: " + dto.getEmail());
            }

            // Validación: Password obligatorio y mínimo 6 caracteres
            if (dto.getPassword() == null || dto.getPassword().length() < 6) {
                return ResponseEntity.badRequest()
                        .body("El password debe tener al menos 6 caracteres");
            }

            // Validación: Rol existe
            Rol rol = rolRepository.findById(dto.getIdRol())
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + dto.getIdRol()));

            // Crear nueva entidad Usuario
            Usuario nuevoUsuario = new Usuario();
            nuevoUsuario.setNombre(dto.getNombre());
            nuevoUsuario.setEmail(dto.getEmail());

            // TODO: IMPORTANTE - Encriptar password con BCrypt
            // Por ahora guardamos en texto plano (NO HACER EN PRODUCCIÓN)
            nuevoUsuario.setPassword(dto.getPassword());

            nuevoUsuario.setTelefono(dto.getTelefono());
            nuevoUsuario.setRol(rol);
            nuevoUsuario.setActivo(true); // Por defecto activo
            // fechaRegistro se setea automáticamente en la Entity

            // Guardar en BD
            Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);

            // Convertir a DTO de respuesta (sin password)
            UsuarioResponseDTO response = mapToResponseDTO(usuarioGuardado);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error al crear usuario: " + e.getMessage());
        }
    }

    // ==========================================
    // 4. ACTUALIZAR USUARIO
    // PUT http://localhost:8080/api/usuarios/{id}
    // ==========================================
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody ActualizarUsuarioDTO dto) {
        try {
            // Buscar usuario existente
            Usuario usuario = usuarioRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

            // Validación: Nombre obligatorio
            if (dto.getNombre() == null || dto.getNombre().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El nombre es obligatorio");
            }

            // Validación: Email obligatorio y formato válido
            if (dto.getEmail() == null || dto.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El email es obligatorio");
            }
            if (!EMAIL_PATTERN.matcher(dto.getEmail()).matches()) {
                return ResponseEntity.badRequest().body("El email no tiene un formato válido");
            }

            // Validación: Email único (solo si cambió)
            if (!usuario.getEmail().equals(dto.getEmail())) {
                Usuario usuarioConEmail = usuarioRepository.findByEmail(dto.getEmail());
                if (usuarioConEmail != null) {
                    return ResponseEntity.badRequest()
                            .body("Ya existe un usuario con el email: " + dto.getEmail());
                }
            }

            // Validación: Rol existe
            if (dto.getIdRol() != null) {
                Rol rol = rolRepository.findById(dto.getIdRol())
                        .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + dto.getIdRol()));
                usuario.setRol(rol);
            }

            // Actualizar campos
            usuario.setNombre(dto.getNombre());
            usuario.setEmail(dto.getEmail());
            usuario.setTelefono(dto.getTelefono());

            if (dto.getActivo() != null) {
                usuario.setActivo(dto.getActivo());
            }

            // Guardar cambios
            Usuario usuarioActualizado = usuarioRepository.save(usuario);

            // Respuesta sin password
            UsuarioResponseDTO response = mapToResponseDTO(usuarioActualizado);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error al actualizar usuario: " + e.getMessage());
        }
    }

    // ==========================================
    // 5. ELIMINAR USUARIO (Soft Delete)
    // DELETE http://localhost:8080/api/usuarios/{id}
    // ==========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            Usuario usuario = usuarioRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

            // Soft delete: marcar como inactivo
            usuario.setActivo(false);
            usuarioRepository.save(usuario);

            return ResponseEntity.ok()
                    .body("Usuario desactivado correctamente");

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error al eliminar usuario: " + e.getMessage());
        }
    }

    // ==========================================
    // 6. OBTENER SOLO USUARIOS ACTIVOS
    // GET http://localhost:8080/api/usuarios/activos
    // ==========================================
    @GetMapping("/activos")
    public ResponseEntity<List<UsuarioResponseDTO>> obtenerActivos() {
        try {
            List<Usuario> usuarios = usuarioRepository.findByActivoTrue();
            List<UsuarioResponseDTO> response = new ArrayList<>();

            for (Usuario usuario : usuarios) {
                response.add(mapToResponseDTO(usuario));
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==========================================
    // 7. OBTENER USUARIOS POR ROL
    // GET http://localhost:8080/api/usuarios/rol/{idRol}
    // ==========================================
    @GetMapping("/rol/{idRol}")
    public ResponseEntity<?> obtenerPorRol(@PathVariable Long idRol) {
        try {
            List<Usuario> usuarios = usuarioRepository.findByRolIdRol(idRol);
            List<UsuarioResponseDTO> response = new ArrayList<>();

            for (Usuario usuario : usuarios) {
                response.add(mapToResponseDTO(usuario));
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error al obtener usuarios: " + e.getMessage());
        }
    }

    // ==========================================
    // MÉTODO AUXILIAR: Mapear Entity a ResponseDTO
    // (Oculta el password y estructura la respuesta)
    // ==========================================
    private UsuarioResponseDTO mapToResponseDTO(Usuario usuario) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setIdUsuario(usuario.getIdUsuario());
        dto.setNombre(usuario.getNombre());
        dto.setEmail(usuario.getEmail());
        dto.setTelefono(usuario.getTelefono());
        dto.setActivo(usuario.getActivo());
        dto.setFechaRegistro(usuario.getFechaRegistro());

        // Información del Rol
        if (usuario.getRol() != null) {
            dto.setIdRol(usuario.getRol().getIdRol());
            dto.setNombreRol(usuario.getRol().getNombre());
        }

        // TODO: Agregar estadísticas del socio (inventario, pedidos)
        // dto.setTotalProductosInventario(calcularInventario(usuario.getIdUsuario()));
        // dto.setTotalPedidosRealizados(contarPedidos(usuario.getIdUsuario()));

        return dto;
    }
}