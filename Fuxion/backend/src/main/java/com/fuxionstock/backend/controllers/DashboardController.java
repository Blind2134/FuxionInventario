package com.fuxionstock.backend.controllers;

import com.fuxionstock.backend.dto.dashboardDTOS.DashboardResumenDTO;
import com.fuxionstock.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/resumen")
    public ResponseEntity<DashboardResumenDTO> obtenerResumen() {
        DashboardResumenDTO resumen = dashboardService.obtenerResumenCompleto();
        return ResponseEntity.ok(resumen);
    }
}