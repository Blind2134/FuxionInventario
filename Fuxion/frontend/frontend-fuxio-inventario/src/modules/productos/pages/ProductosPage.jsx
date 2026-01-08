// =========================================
// ProductosPage.jsx - VERSIÓN CON FILTROS AVANZADOS
// Ubicación: src/modules/productos/pages/ProductosPage.jsx
// =========================================

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiGrid, FiList } from "react-icons/fi";
import { useProductos } from "../hooks/useProductos";
import ProductoCard from "../components/ProductoCard";
import ProductoModal from "../components/ProductoModal";
import ProductoFilters from "../components/ProductoFilters";

const ProductosPage = () => {
  const { productos, loading, deleteProducto } = useProductos();
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [filters, setFilters] = useState({
    categoria: "",
    precioMin: "",
    precioMax: "",
    sticksMin: "",
    sticksMax: "",
    soloActivos: true,
  });

  // Obtener categorías únicas de los productos
  const categorias = useMemo(() => {
    const cats = productos
      .map((p) => p.categoria)
      .filter((c) => c && c.trim() !== "");
    return [...new Set(cats)];
  }, [productos]);

  // Filtrar productos según búsqueda y filtros
  const filteredProductos = useMemo(() => {
    return productos.filter((producto) => {
      // Filtro de búsqueda
      const matchesSearch =
        !searchTerm ||
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.sku?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de categoría
      const matchesCategoria =
        !filters.categoria || producto.categoria === filters.categoria;

      // Filtro de precio
      const matchesPrecio =
        (!filters.precioMin ||
          parseFloat(producto.precioReferencial) >=
            parseFloat(filters.precioMin)) &&
        (!filters.precioMax ||
          parseFloat(producto.precioReferencial) <=
            parseFloat(filters.precioMax));

      // Filtro de sticks
      const matchesSticks =
        (!filters.sticksMin ||
          producto.sticksPorSobre >= parseInt(filters.sticksMin)) &&
        (!filters.sticksMax ||
          producto.sticksPorSobre <= parseInt(filters.sticksMax));

      // Filtro de estado
      const matchesActivo = !filters.soloActivos || producto.activo;

      return (
        matchesSearch &&
        matchesCategoria &&
        matchesPrecio &&
        matchesSticks &&
        matchesActivo
      );
    });
  }, [productos, searchTerm, filters]);

  // Confirmar eliminación
  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      deleteProducto(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600 mt-1">
            Gestiona el catálogo de productos FuXion
          </p>
        </div>
        <Link to="/productos/crear" className="btn btn-primary">
          <FiPlus className="inline mr-2" />
          Nuevo Producto
        </Link>
      </div>

      {/* Componente de Filtros */}
      <ProductoFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onFilterChange={setFilters}
        categorias={categorias}
      />

      {/* Barra de acciones */}
      <div className="flex items-center justify-between">
        {/* Contador de resultados */}
        <div className="text-sm text-gray-600">
          Mostrando{" "}
          <span className="font-semibold text-gray-900">
            {filteredProductos.length}
          </span>{" "}
          de{" "}
          <span className="font-semibold text-gray-900">
            {productos.length}
          </span>{" "}
          productos
        </div>

        {/* Vista Grid/List */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            title="Vista Grid"
          >
            <FiGrid size={20} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list"
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            title="Vista Lista"
          >
            <FiList size={20} />
          </button>
        </div>
      </div>

      {/* Lista de productos */}
      {filteredProductos.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || Object.values(filters).some((v) => v && v !== true)
              ? "Intenta ajustar los filtros de búsqueda"
              : "Comienza agregando tu primer producto"}
          </p>
          {(searchTerm ||
            Object.values(filters).some((v) => v && v !== true)) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilters({
                  categoria: "",
                  precioMin: "",
                  precioMax: "",
                  sticksMin: "",
                  sticksMax: "",
                  soloActivos: true,
                });
              }}
              className="btn btn-secondary mx-auto"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredProductos.map((producto) => (
            <ProductoCard
              key={producto.idProducto}
              producto={producto}
              onDelete={handleDelete}
              onViewDetails={setSelectedProducto}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Modal de detalles */}
      {selectedProducto && (
        <ProductoModal
          producto={selectedProducto}
          onClose={() => setSelectedProducto(null)}
        />
      )}
    </div>
  );
};

export default ProductosPage;
