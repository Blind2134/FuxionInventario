package com.fuxionstock.backend.dto.dashboardDTOS;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResumenDTO {
    private KPIsDTO kpis;
    private List<VentaDiaDTO> ventasUltimos7Dias;
    private List<VentaDiaDTO> ventasUltimos30Dias;
    private List<TopProductoDTO> topProductos;
    private List<PedidoEstadoDTO> pedidosPorEstado;
    private List<UltimoPedidoDTO> ultimosPedidos;
    private List<StockCriticoDTO> stockCritico;
    private List<TopVendedorDTO> topVendedores;
    private List<AlertaDTO> alertas;
}