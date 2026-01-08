package com.fuxionstock.backend.controllers;

import com.fuxionstock.backend.entity.Rol;
import com.fuxionstock.backend.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class RolController {

    @Autowired
    private RolRepository rolRepository;

    // ==========================================
    // 1. OBTENER TODOS LOS ROLES
    // GET http://localhost:8080/api/roles
    // ==========================================
    @GetMapping
    public ResponseEntity<List<Rol>> obtenerTodos() {
        try {
            List<Rol> roles = rolRepository.findAll();
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==========================================
    // 2. OBTENER UN ROL POR ID
    // GET http://localhost:8080/api/roles/{id}
    // ==========================================
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            Rol rol = rolRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + id));
            return ResponseEntity.ok(rol);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}