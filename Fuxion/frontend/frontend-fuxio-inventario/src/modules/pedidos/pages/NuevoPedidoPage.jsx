import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import CrearPedidoForm from "../components/CrearPedidoForm";

// Hooks
import { useSocios } from "../../usuarios/hooks/useSocios";
import { pedidosApi } from "../../../api/enpoints/pedidosApi";
import { inventarioApi } from "../../../api/enpoints/inventarioApi";

const NuevoPedidoPage = () => {
  const navigate = useNavigate();
  const { socios } = useSocios(); // Cargamos la lista de vendedores

  const [loading, setLoading] = useState(false);
  const [inventarioVendedor, setInventarioVendedor] = useState([]);

  // Esta función se ejecuta cuando cambias el vendedor en el Formulario
  const handleVendedorChange = async (idVendedor) => {
    console.log("--> handleVendedorChange recibió:", idVendedor);

    if (!idVendedor) {
      setInventarioVendedor([]);
      return;
    }

    try {
      const data = await inventarioApi.getBySocio(idVendedor);
      const listaCruda = data.productos || [];

      const inventarioFormateado = listaCruda.map((item) => {
        // 1. Calculamos el texto exacto con paréntesis separados
        let infoStock = "";

        // CASO 1: Tiene sobres Y sticks -> (1 sobres) (28 sticks)
        if (item.cantidadSobres > 0 && item.cantidadSticks > 0) {
          infoStock = `(${item.cantidadSobres} sobres) (${item.cantidadSticks} sticks)`;
        }
        // CASO 2: Solo tiene sobres -> (1 sobres)
        else if (item.cantidadSobres > 0) {
          infoStock = `(${item.cantidadSobres} sobres)`;
        }
        // CASO 3: Solo tiene sticks -> (28 sticks)
        else {
          infoStock = `(${item.cantidadSticks} sticks)`;
        }

        return {
          idProducto: item.idProducto,
          // 2. Quitamos el guion "-" que tenías antes.
          // Ahora queda: "PRUNEX (1 sobres) (28 sticks)"
          nombreProducto: `${item.nombreProducto} ${infoStock}`,

          // Datos originales (sin cambios)
          nombreOriginal: item.nombreProducto,
          cantidadSticks: item.cantidadSticks,
          cantidadSobres: item.cantidadSobres,
          precio: item.precio || 0,
        };
      });

      setInventarioVendedor(inventarioFormateado);
    } catch (error) {
      console.error("Error cargando inventario:", error);
      setInventarioVendedor([]);
    }
  };
  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await pedidosApi.create(formData);
      alert("¡Pedido registrado exitosamente!");
      navigate("/pedidos");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error al crear el pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <FiArrowLeft className="mr-2" /> Volver al listado
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nuevo Pedido</h1>
        <p className="text-gray-600 mt-2">
          Registra una venta de stock. Selecciona el vendedor para ver su
          disponibilidad.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <CrearPedidoForm
          vendedores={socios} // Lista de usuarios
          inventarioDisponible={inventarioVendedor} // Stock del usuario seleccionado
          onVendedorChange={handleVendedorChange} // Acción al cambiar usuario
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default NuevoPedidoPage;
