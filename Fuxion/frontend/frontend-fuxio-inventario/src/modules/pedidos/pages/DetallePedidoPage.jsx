import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiMapPin,
  FiPackage,
  FiTruck,
  FiPhone,
} from "react-icons/fi";
import axios from "../../../api/axiosConfig";

const DetallePedidoPage = () => {
  const { idPedido } = useParams();
  const navigate = useNavigate();

  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);

  // 1. Cargar datos
  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const response = await axios.get(`/pedidos/${idPedido}`);
        setPedido(response.data);
      } catch (error) {
        console.error("Error cargando pedido:", error);
        alert("No se pudo cargar el pedido.");
        navigate("/pedidos");
      } finally {
        setLoading(false);
      }
    };
    if (idPedido) fetchPedido();
  }, [idPedido, navigate]);

  // 2. Función para Empaquetar
  const handleEmpaquetar = async () => {
    if (!window.confirm("¿Confirmar empaquetado?")) return;
    setProcesando(true);
    try {
      await axios.post(`/pedidos/${idPedido}/empaquetar`);
      setPedido({ ...pedido, estado: "EMPAQUETADO" });
    } catch (error) {
      alert("Error al actualizar estado.");
    } finally {
      setProcesando(false);
    }
  };

  // 3. NUEVA FUNCIÓN: Lógica visual de Sobres vs Sticks
  // Esta función se encarga de dibujar los cuadritos de colores
  const renderizarCantidad = (sobres, sticks) => {
    return (
      <div className="flex items-center justify-center gap-3">
        {/* SOBRES */}
        {sobres > 0 && (
          <div className="flex flex-col items-center bg-blue-50 px-2 py-1 rounded border border-blue-200">
            <span className="text-xl font-bold text-blue-700 leading-none">
              {sobres}
            </span>
            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
              Sobres
            </span>
          </div>
        )}

        {/* Separador */}
        {sobres > 0 && sticks > 0 && (
          <span className="text-gray-300 text-xl">|</span>
        )}

        {/* STICKS */}
        {sticks > 0 && (
          <div className="flex flex-col items-center px-2 py-1">
            <span className="text-xl font-bold text-gray-700 leading-none">
              {sticks}
            </span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              Sticks
            </span>
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="p-10 text-center">Cargando...</div>;
  if (!pedido) return null;

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      <button
        onClick={() => navigate("/pedidos")}
        className="flex items-center text-gray-500 hover:text-blue-600"
      >
        <FiArrowLeft className="mr-2" /> Volver a Pedidos
      </button>

      {/* Header del Pedido */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">
              Pedido #{pedido.codigoPedido}
            </h1>
            <span className="px-3 py-1 rounded-full text-sm font-bold bg-gray-100 border text-gray-700">
              {pedido.estado}
            </span>
          </div>
          <p className="text-gray-500 mt-1">
            {new Date(pedido.fechaCreacion).toLocaleString()}
          </p>
        </div>
        {pedido.estado === "PENDIENTE" && (
          <button
            onClick={handleEmpaquetar}
            disabled={procesando}
            className="btn btn-primary flex items-center gap-2"
          >
            <FiPackage />{" "}
            {procesando ? "Procesando..." : "Marcar como Empaquetado"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-2">
          {/* Datos Cliente */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiUser className="text-blue-600" /> Datos del Cliente
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500">
                  NOMBRE
                </label>
                <p className="font-medium">{pedido.clienteNombre}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">
                  TELÉFONO
                </label>
                <p className="font-medium flex items-center gap-2">
                  <FiPhone /> {pedido.clienteTelefono}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500">
                  DIRECCIÓN
                </label>
                <p className="font-medium flex items-center gap-2">
                  <FiMapPin /> {pedido.clienteDireccion}
                </p>
              </div>
            </div>
          </div>

          {/* Tabla Productos */}
          <div className="card p-0 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FiPackage className="text-blue-600" /> Productos
              </h3>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-white text-gray-500 border-b">
                <tr>
                  <th className="px-6 py-3">Producto</th>
                  <th className="px-6 py-3 text-center">Cant.</th>
                  <th className="px-6 py-3">Origen Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pedido.detalles?.map((detalle) => (
                  <tr key={detalle.idDetalle}>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {detalle.producto.nombre}
                    </td>

                    {/* AQUÍ LLAMAMOS A LA FUNCIÓN DE VISUALIZACIÓN */}
                    <td className="px-6 py-4 text-center">
                      {renderizarCantidad(
                        detalle.cantidadSobres || 0,
                        detalle.cantidadSticks || 0
                      )}
                    </td>

                    <td className="px-6 py-4 text-xs text-gray-500">
                      {detalle.duenoStock?.idUsuario !==
                      pedido.vendedor?.idUsuario ? (
                        <span className="text-orange-600 font-bold bg-orange-100 px-2 py-1 rounded">
                          Prestado: {detalle.duenoStock?.nombre}
                        </span>
                      ) : (
                        "Stock Propio"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen Económico */}
        <div className="space-y-6">
          <div className="card p-6 bg-blue-50 border-blue-100">
            <h3 className="font-bold text-blue-900 mb-4">Resumen Económico</h3>
            <div className="flex justify-between items-center">
              <span className="text-blue-800">Total Venta</span>
              <span className="text-2xl font-bold text-blue-900">
                S/ {parseFloat(pedido.montoTotalVenta || 0).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex gap-2">
              <FiTruck /> Seguimiento
            </h3>
            <div className="border-l-2 border-blue-500 pl-4 ml-2">
              <p className="font-bold text-gray-900">Pedido Creado</p>
              <p className="text-xs text-gray-500">
                {new Date(pedido.fechaCreacion).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallePedidoPage;
