import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiGrid, FiList, FiUsers } from "react-icons/fi";
import { useSocios } from "../hooks/useSocios";
import { useRoles } from "../hooks/useRoles";
import SocioCard from "../components/SocioCard";
import SocioModal from "../components/SocioModal";
import SocioFilters from "../components/SocioFilters";

const SociosPage = () => {
  const { socios, loading, deleteSocio, reactivarSocio } = useSocios();
  const { roles } = useRoles();
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSocio, setSelectedSocio] = useState(null);
  const [filters, setFilters] = useState({
    idRol: "",
    soloActivos: true,
  });

  // Filtrar socios según búsqueda y filtros
  const filteredSocios = useMemo(() => {
    return socios.filter((socio) => {
      // Filtro de búsqueda
      const matchesSearch =
        !searchTerm ||
        socio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        socio.email.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de rol
      const matchesRol =
        !filters.idRol || socio.idRol === parseInt(filters.idRol);

      // Filtro de estado
      const matchesActivo = !filters.soloActivos || socio.activo;

      return matchesSearch && matchesRol && matchesActivo;
    });
  }, [socios, searchTerm, filters]);

  // Confirmar desactivación
  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de desactivar este socio?")) {
      deleteSocio(id);
    }
  };

  // Confirmar reactivación
  const handleReactivar = (id) => {
    if (window.confirm("¿Estás seguro de reactivar este socio?")) {
      reactivarSocio(id);
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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FiUsers className="text-blue-600" />
            Socios
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona los vendedores, almaceneros y administradores
          </p>
        </div>
        <Link to="/usuarios/crear" className="btn btn-primary">
          <FiPlus className="inline mr-2" />
          Nuevo Socio
        </Link>
      </div>

      {/* Componente de Filtros */}
      <SocioFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onFilterChange={setFilters}
        roles={roles}
      />

      {/* Barra de acciones */}
      <div className="flex items-center justify-between">
        {/* Contador de resultados */}
        <div className="text-sm text-gray-600">
          Mostrando{" "}
          <span className="font-semibold text-gray-900">
            {filteredSocios.length}
          </span>{" "}
          de{" "}
          <span className="font-semibold text-gray-900">{socios.length}</span>{" "}
          socios
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

      {/* Lista de socios */}
      {filteredSocios.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron socios
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filters.idRol
              ? "Intenta ajustar los filtros de búsqueda"
              : "Comienza agregando tu primer socio"}
          </p>
          {(searchTerm || filters.idRol) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilters({
                  idRol: "",
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
              : "space-y-2"
          }
        >
          {filteredSocios.map((socio) => (
            <SocioCard
              key={socio.idUsuario}
              socio={socio}
              onDelete={handleDelete}
              onViewDetails={setSelectedSocio}
              onReactivar={handleReactivar}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Modal de detalles */}
      {selectedSocio && (
        <SocioModal
          socio={selectedSocio}
          onClose={() => setSelectedSocio(null)}
        />
      )}
    </div>
  );
};

export default SociosPage;
