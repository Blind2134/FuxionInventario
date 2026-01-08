package com.fuxionstock.backend.service.impl;

import com.fuxionstock.backend.dto.CrearProductoDTO;
import com.fuxionstock.backend.dto.ProductoResponseDTO;
import com.fuxionstock.backend.entity.Producto;
import com.fuxionstock.backend.repository.ProductoRepository;
import com.fuxionstock.backend.service.ProductoService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private static final String ESTADO_ACTIVO = "ACTIVO";
    private static final String ESTADO_INACTIVO = "INACTIVO";


    @Override
    public ProductoResponseDTO crearProducto(CrearProductoDTO dto) {

        productoRepository.findByNombreIgnoreCase(dto.getNombre())
                .ifPresent(p -> {
                    throw new RuntimeException("El producto ya existe");
                });
        Producto producto = Producto.builder()
                .nombre(dto.getNombre())
                .categoria(dto.getCategoria())
                .sku(dto.getSku())
                .imgUrl(dto.getImgUrl())
                .sticksPorSobre(dto.getSticksPorSobre())
                .precioReferencial(dto.getPrecioReferencial())
                .estado(ESTADO_ACTIVO)
                .build();

        return mapToDTO(productoRepository.save(producto));

    }

    @Override
    public List<ProductoResponseDTO> listarProductos() {
        return productoRepository.findByEstado(ESTADO_ACTIVO)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public ProductoResponseDTO obtenerPorId(Long idProducto) {
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        return mapToDTO(producto);
    }


    @Override
    public ProductoResponseDTO actualizarProducto(Long idProducto, CrearProductoDTO dto) {

        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        producto.setNombre(dto.getNombre());
        producto.setCategoria(dto.getCategoria());
        producto.setSku(dto.getSku());
        producto.setImgUrl(dto.getImgUrl());
        producto.setSticksPorSobre(dto.getSticksPorSobre());
        producto.setPrecioReferencial(dto.getPrecioReferencial());

        return mapToDTO(productoRepository.save(producto));
    }

    @Override
    public void desactivarProducto(Long idProducto) {
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        producto.setEstado(ESTADO_INACTIVO);
        productoRepository.save(producto);
    }

    private ProductoResponseDTO mapToDTO(Producto producto) {
        return ProductoResponseDTO.builder()
                .idProducto(producto.getIdProducto())
                .nombre(producto.getNombre())
                .categoria(producto.getCategoria())
                .sku(producto.getSku())
                .imgUrl(producto.getImgUrl())
                .sticksPorSobre(producto.getSticksPorSobre())
                .precioReferencial(producto.getPrecioReferencial())
                .activo(ESTADO_ACTIVO.equals(producto.getEstado()))
                .build();
    }

}
