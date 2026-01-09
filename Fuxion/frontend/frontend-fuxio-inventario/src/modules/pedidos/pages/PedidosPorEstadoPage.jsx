import { useMemo } from "react";
import {
  FiClock,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { usePedidos } from "../hooks/usePedidos";
import PedidoCard from "../components/PedidoCard";

const PedidosPorEstadoPage = () => {
  const { pedidos, loading, handleConfirmarEntrega } = usePedidos();

  // Separar pedidos en columnas
  const columnas = useMemo(() => {
    return {
      PENDIENTE: pedidos.filter((p) => p.estado === "PENDIENTE"),
      EMPAQUETADO: pedidos.filter((p) => p.estado === "EMPAQUETADO"),
      ENTREGADO_MOTORIZADO: pedidos.filter(
        (p) => p.estado === "ENTREGADO_MOTORIZADO"
      ),
      CANCELADO: pedidos.filter((p) => p.estado === "CANCELADO"),
    };
  }, [pedidos]);

  const onConfirmar = async (id) => {
    if (window.confirm("¿Confirmar entrega y cobro?")) {
      await handleConfirmarEntrega(id);
    }
  };

  if (loading)
    return <div className="p-10 text-center">Cargando tablero...</div>;

  // Configuración visual de cada columna
  const configColumnas = [
    {
      id: "PENDIENTE",
      titulo: "Pendientes",
      icon: <FiClock />,
      color: "bg-yellow-50 border-yellow-200 text-yellow-800",
    },
    {
      id: "EMPAQUETADO",
      titulo: "Empaquetados",
      icon: <FiPackage />,
      color: "bg-blue-50 border-blue-200 text-blue-800",
    },
    {
      id: "ENTREGADO_MOTORIZADO",
      titulo: "Entregados",
      icon: <FiCheckCircle />,
      color: "bg-green-50 border-green-200 text-green-800",
    },
    // Puedes descomentar si quieres ver los cancelados
    // { id: "CANCELADO", titulo: "Cancelados", icon: <FiXCircle />, color: "bg-red-50 border-red-200 text-red-800" },
  ];

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      <div className="mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Tablero de Pedidos</h1>
        <p className="text-gray-500">Gestión visual del flujo de entrega</p>
      </div>

      {/* Contenedor Scrollable Horizontal para el Kanban */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex h-full gap-6 min-w-[1000px]">
          {" "}
          {/* min-w asegura que no se aplaste en móviles */}
          {configColumnas.map((col) => (
            <div
              key={col.id}
              className="flex-1 flex flex-col min-w-[300px] h-full"
            >
              {/* Cabecera Columna */}
              <div
                className={`p-3 rounded-t-xl border-b-0 border ${col.color} flex items-center justify-between`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {col.icon} {col.titulo}
                </div>
                <span className="bg-white/50 px-2 py-0.5 rounded text-xs font-bold">
                  {columnas[col.id].length}
                </span>
              </div>

              {/* Cuerpo Columna (Scrollable verticalmente) */}
              <div className="bg-gray-100/50 border border-gray-200 border-t-0 rounded-b-xl p-3 flex-1 overflow-y-auto space-y-3">
                {columnas[col.id].length > 0 ? (
                  columnas[col.id].map((pedido) => (
                    <div
                      key={pedido.idPedido}
                      className="transform scale-95 hover:scale-100 transition-transform origin-top"
                    >
                      <PedidoCard
                        pedido={pedido}
                        viewMode="grid"
                        onConfirmarEntrega={onConfirmar}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-400 text-sm italic">
                    No hay pedidos aquí
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PedidosPorEstadoPage;
