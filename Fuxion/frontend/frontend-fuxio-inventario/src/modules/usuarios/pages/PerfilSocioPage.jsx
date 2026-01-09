import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiCalendar,
  FiPackage,
  FiShoppingCart,
  FiEdit2,
  FiBox,
  FiList,
  FiEye,
} from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { sociosApi } from "../../../api/enpoints/sociosApi";
import { inventarioApi } from "../../../api/enpoints/inventarioApi";
import axios from "../../../api/axiosConfig";
import { toast } from "react-toastify";

const PerfilSocioPage = () => {
  const { id } = useParams();
  const [socio, setSocio] = useState(null);
  const [inventario, setInventario] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        // 1. Cargar Socio
        const dataSocio = await sociosApi.getById(id);
        setSocio(dataSocio);

        // 2. Cargar Inventario
        try {
          const dataInv = await inventarioApi.getBySocio(id);
          // CORRECCIÓN 1: Extraer correctamente el array productos
          const listaInv = dataInv.productos || [];
          setInventario(listaInv);
        } catch (e) {
          console.error("Error inventario", e);
        }

        // 3. Cargar Pedidos (VENTAS DEL SOCIO)
        try {
          const resPedidos = await axios.get("/pedidos");
          const misPedidos = resPedidos.data.filter(
            (p) => p.vendedor?.idUsuario === parseInt(id)
          );

          misPedidos.sort(
            (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
          );

          setPedidos(misPedidos);
        } catch (e) {
          console.error("Error pedidos", e);
        }
      } catch (err) {
        toast.error("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };

    if (id) cargarDatos();
  }, [id]);

  const getInitials = (n) =>
    n
      ? n
          .split(" ")
          .map((p) => p[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : "??";

  const renderStock = (sobres, sticks) => (
    <div className="flex gap-2">
      {sobres > 0 && (
        <span className="px-2 py-1 text-xs font-bold rounded border bg-blue-50 text-blue-700 border-blue-200">
          {sobres} Sobres
        </span>
      )}
      {(sticks > 0 || sobres === 0) && (
        <span className="px-2 py-1 text-xs font-bold rounded border bg-gray-50 text-gray-700 border-gray-200">
          {sticks} Sticks
        </span>
      )}
    </div>
  );

  if (loading)
    return <div className="p-10 text-center">Cargando perfil...</div>;
  if (!socio)
    return <div className="p-10 text-center">Socio no encontrado</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {/* Header y Datos Personales */}
      <div>
        <Link
          to="/usuarios"
          className="flex items-center text-blue-600 mb-4 hover:underline"
        >
          <FiArrowLeft className="mr-2" /> Volver a Socios
        </Link>

        <div className="card flex flex-col md:flex-row gap-6 items-center md:items-start p-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {getInitials(socio.nombre)}
            </div>
            <Link
              to={`/usuarios/editar/${id}`}
              className="mt-3 text-sm text-blue-600 hover:underline flex items-center"
            >
              <FiEdit2 className="mr-1" /> Editar
            </Link>
          </div>

          <div className="flex-1 w-full">
            <h1 className="text-3xl font-bold text-gray-900 text-center md:text-left">
              {socio.nombre}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                {socio.nombreRol}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  socio.activo
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {socio.activo ? "ACTIVO" : "INACTIVO"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded border">
                <span className="block text-xs font-bold text-gray-400 uppercase">
                  Email
                </span>
                {socio.email}
              </div>
              <div className="bg-gray-50 p-3 rounded border">
                <span className="block text-xs font-bold text-gray-400 uppercase">
                  Teléfono
                </span>
                {socio.telefono || "-"}
              </div>
              <div className="bg-gray-50 p-3 rounded border">
                <span className="block text-xs font-bold text-gray-400 uppercase">
                  Registro
                </span>
                {new Date(socio.fechaRegistro).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: INVENTARIO ACTUAL */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-lg flex items-center gap-2 text-gray-800">
            <FiBox className="text-blue-600" /> Inventario Disponible
          </h2>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-bold">
            {inventario.length} Productos
          </span>
        </div>

        {inventario.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white text-gray-500 border-b">
                <tr>
                  <th className="px-6 py-3">Producto</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3 text-right">Actualizado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* CORRECCIÓN 2 y 3: Usar idProducto como key y nombreProducto para mostrar */}
                {inventario.map((item) => (
                  <tr key={item.idProducto} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium">
                      {item.nombreProducto}
                    </td>
                    <td className="px-6 py-3">
                      {renderStock(item.cantidadSobres, item.cantidadSticks)}
                    </td>
                    <td className="px-6 py-3 text-right text-gray-400 text-xs">
                      {item.fechaActualizacion
                        ? new Date(item.fechaActualizacion).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">
            Sin stock disponible.
          </div>
        )}
      </div>

      {/* SECCIÓN 2: HISTORIAL DE PEDIDOS (VENTAS) */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-lg flex items-center gap-2 text-gray-800">
            <FiShoppingCart className="text-green-600" /> Historial de Ventas
          </h2>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-bold">
            {pedidos.length} Pedidos
          </span>
        </div>

        {pedidos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white text-gray-500 border-b">
                <tr>
                  <th className="px-6 py-3">Código</th>
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">Fecha</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3 text-center">Estado</th>
                  <th className="px-6 py-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pedidos.map((p) => (
                  <tr key={p.idPedido} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-mono text-xs font-bold text-gray-600">
                      {p.codigoPedido}
                    </td>
                    <td className="px-6 py-3 font-medium">
                      {p.clienteNombre}
                      <span className="block text-xs text-gray-400 font-normal">
                        {p.detalles?.some(
                          (d) => d.duenoStock?.idUsuario !== socio.idUsuario
                        ) ? (
                          <span className="text-orange-500 font-bold">
                            ⚠️ Con Préstamo
                          </span>
                        ) : (
                          ""
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                      {new Date(p.fechaCreacion).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 font-bold text-green-700">
                      S/ {p.montoTotalVenta?.toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold border ${
                          p.estado === "PENDIENTE"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : p.estado === "EMPAQUETADO"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <Link
                        to={`/pedidos/detalle/${p.idPedido}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">
            Este socio aún no ha realizado ventas.
          </div>
        )}
      </div>
    </div>
  );
};

export default PerfilSocioPage;
