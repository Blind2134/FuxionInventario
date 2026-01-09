import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiGrid, FiList, FiSearch, FiFilter } from "react-icons/fi";
import { usePedidos } from "../hooks/usePedidos"; // Asegúrate de tener este hook creado
import PedidoCard from "../components/PedidoCard";

const PedidosPage = () => {
  const { pedidos, loading, confirmarEntrega } = usePedidos();

  const [viewMode, setViewMode] = useState("list"); // 'list' o 'grid'
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  // Lógica de Filtrado
  const filteredPedidos = useMemo(() => {
    return pedidos.filter((pedido) => {
      const matchSearch =
        pedido.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.codigoPedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pedido.vendedor?.nombre || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchEstado = filterEstado ? pedido.estado === filterEstado : true;

      return matchSearch && matchEstado;
    });
  }, [pedidos, searchTerm, filterEstado]);

  const onConfirmar = async (id) => {
    if (window.confirm("¿Confirmar que el pedido fue entregado y cobrado?")) {
      await confirmarEntrega(id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Pedidos
          </h1>
          <p className="text-gray-500 text-sm">
            Administra las ventas y entregas
          </p>
        </div>
        <Link to="/pedidos/nuevo" className="btn btn-primary">
          <FiPlus className="mr-2" /> Nuevo Pedido
        </Link>
      </div>

      {/* Barra de Herramientas (Búsqueda y Filtros) */}
      <div className="card p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Buscador */}
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, código o vendedor..."
            className="input pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtros y Vistas */}
        <div className="flex gap-2 w-full md:w-auto">
          <select
            className="input w-full md:w-48"
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="EMPAQUETADO">Empaquetado</option>
            <option value="ENTREGADO_MOTORIZADO">Entregado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>

          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "list"
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Vista Lista"
            >
              <FiList size={20} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "grid"
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Vista Cuadrícula"
            >
              <FiGrid size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-3"
        }
      >
        {filteredPedidos.length > 0 ? (
          filteredPedidos.map((pedido) => (
            <PedidoCard
              key={pedido.idPedido}
              pedido={pedido}
              onConfirmarEntrega={onConfirmar}
              viewMode={viewMode} // Pasamos el modo de vista al componente
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            No se encontraron pedidos con estos filtros.
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidosPage;
