package com.fuxionstock.backend.dto.dashboardDTOS;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VentaDiaDTO {
    private LocalDate fecha;
    private Double monto;
}