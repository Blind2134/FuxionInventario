// =========================================
// ProductoFilters.jsx
// Ubicación: src/modules/productos/components/ProductoFilters.jsx
// =========================================

import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import { useState } from "react";

const ProductoFilters = ({
  searchTerm,
  onSearchChange,
  onFilterChange,
  categorias = [],
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categoria: "",
    precioMin: "",
    precioMax: "",
    sticksMin: "",
    sticksMax: "",
    soloActivos: true,
  });

  // Manejar cambio de filtros
  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Limpiar todos los filtros
  const clearFilters = () => {
    const clearedFilters = {
      categoria: "",
      precioMin: "",
      precioMax: "",
      sticksMin: "",
      sticksMax: "",
      soloActivos: true,
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
    onSearchChange("");
  };

  // Contar filtros activos
  const activeFiltersCount =
    Object.entries(filters).filter(([key, value]) => {
      if (key === "soloActivos") return false; // No contar este como filtro
      return value !== "" && value !== null;
    }).length + (searchTerm ? 1 : 0);

  return (
    <div className="card space-y-4">
      {/* Barra de búsqueda principal */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Input de búsqueda */}
        <div className="relative flex-1">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por nombre, SKU o categoría..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input pl-10 pr-10"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FiX size={20} />
            </button>
          )}
        </div>

        {/* Botón de filtros avanzados */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn flex items-center gap-2 ${
            showFilters || activeFiltersCount > 0
              ? "btn-primary"
              : "btn-secondary"
          }`}
        >
          <FiFilter size={18} />
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Panel de filtros avanzados (desplegable) */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Filtro por categoría */}
            <div>
              <label className="label">Categoría</label>
              <select
                value={filters.categoria}
                onChange={(e) =>
                  handleFilterChange("categoria", e.target.value)
                }
                className="input"
              >
                <option value="">Todas las categorías</option>
                {categorias.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Rango de precio */}
            <div>
              <label className="label">Precio Mínimo (S/)</label>
              <input
                type="number"
                placeholder="0.00"
                value={filters.precioMin}
                onChange={(e) =>
                  handleFilterChange("precioMin", e.target.value)
                }
                className="input"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="label">Precio Máximo (S/)</label>
              <input
                type="number"
                placeholder="999.99"
                value={filters.precioMax}
                onChange={(e) =>
                  handleFilterChange("precioMax", e.target.value)
                }
                className="input"
                min="0"
                step="0.01"
              />
            </div>

            {/* Rango de sticks */}
            <div>
              <label className="label">Sticks Mínimos</label>
              <input
                type="number"
                placeholder="0"
                value={filters.sticksMin}
                onChange={(e) =>
                  handleFilterChange("sticksMin", e.target.value)
                }
                className="input"
                min="0"
              />
            </div>

            <div>
              <label className="label">Sticks Máximos</label>
              <input
                type="number"
                placeholder="100"
                value={filters.sticksMax}
                onChange={(e) =>
                  handleFilterChange("sticksMax", e.target.value)
                }
                className="input"
                min="0"
              />
            </div>

            {/* Estado del producto */}
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.soloActivos}
                  onChange={(e) =>
                    handleFilterChange("soloActivos", e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Solo productos activos
                </span>
              </label>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={clearFilters}
              className="btn btn-secondary text-sm"
            >
              <FiX className="inline mr-1" />
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* Resumen de filtros activos */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
              Búsqueda: "{searchTerm}"
              <button
                onClick={() => onSearchChange("")}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <FiX size={14} />
              </button>
            </span>
          )}

          {filters.categoria && (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2">
              Categoría: {filters.categoria}
              <button
                onClick={() => handleFilterChange("categoria", "")}
                className="hover:bg-purple-200 rounded-full p-0.5"
              >
                <FiX size={14} />
              </button>
            </span>
          )}

          {(filters.precioMin || filters.precioMax) && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2">
              Precio: S/{filters.precioMin || "0"} - S/
              {filters.precioMax || "∞"}
              <button
                onClick={() => {
                  handleFilterChange("precioMin", "");
                  handleFilterChange("precioMax", "");
                }}
                className="hover:bg-green-200 rounded-full p-0.5"
              >
                <FiX size={14} />
              </button>
            </span>
          )}

          {(filters.sticksMin || filters.sticksMax) && (
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-2">
              Sticks: {filters.sticksMin || "0"} - {filters.sticksMax || "∞"}
              <button
                onClick={() => {
                  handleFilterChange("sticksMin", "");
                  handleFilterChange("sticksMax", "");
                }}
                className="hover:bg-orange-200 rounded-full p-0.5"
              >
                <FiX size={14} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductoFilters;
