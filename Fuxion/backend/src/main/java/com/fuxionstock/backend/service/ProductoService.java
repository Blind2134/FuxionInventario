package com.fuxionstock.backend.service;

import com.fuxionstock.backend.dto.CrearProductoDTO;
import com.fuxionstock.backend.dto.ProductoResponseDTO;

import java.util.List;

public interface ProductoService {

    ProductoResponseDTO crearProducto(CrearProductoDTO dto);

    List<ProductoResponseDTO> listarProductos();

    ProductoResponseDTO obtenerPorId(Long idProducto);

    ProductoResponseDTO actualizarProducto(Long idProducto, CrearProductoDTO dto);

    void desactivarProducto(Long idProducto);
}
