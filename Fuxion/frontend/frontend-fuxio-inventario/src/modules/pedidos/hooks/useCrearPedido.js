import { useState } from "react";
import { pedidosApi } from "../../../api/enpoints/pedidosApi";
import { inventarioApi } from "../../../api/enpoints/inventarioApi";
import { toast } from "react-toastify";

export const useCrearPedido = () => {
  const [loading, setLoading] = useState(false);
  const [inventarioDisponible, setInventarioDisponible] = useState([]);

  // Cargar inventario de un vendedor
  const cargarInventarioVendedor = async (idVendedor) => {
    try {
      const data = await inventarioApi.getBySocio(idVendedor);
      // Aseguramos que data sea un array, dependiendo de cómo responda tu backend (a veces es data.productos)
      setInventarioDisponible(
        Array.isArray(data) ? data : data.productos || []
      );
    } catch (err) {
      console.error("Error al cargar inventario:", err);
      toast.error("Error al cargar inventario del vendedor");
    }
  };

  // --- CAMBIO: VALIDACIÓN DUAL (Cajas y Sticks) ---
  const validarStock = (idProducto, cantidadSobres, cantidadSticks) => {
    const producto = inventarioDisponible.find(
      (p) => p.idProducto === parseInt(idProducto)
    );

    if (!producto) {
      return { valido: false, mensaje: "Producto no encontrado en inventario" };
    }

    // 1. Validar Cajas (Sobres)
    if (producto.cantidadSobres < cantidadSobres) {
      return {
        valido: false,
        mensaje: `Stock insuficiente de CAJAS para ${producto.nombreProducto}. Tienes ${producto.cantidadSobres}, pides ${cantidadSobres}.`,
      };
    }

    // 2. Validar Sticks
    if (producto.cantidadSticks < cantidadSticks) {
      return {
        valido: false,
        mensaje: `Stock insuficiente de STICKS SUELTOS para ${producto.nombreProducto}. Tienes ${producto.cantidadSticks}, pides ${cantidadSticks}. (Usa 'Abrir Caja' si necesitas más).`,
      };
    }

    return { valido: true };
  };

  // Crear pedido
  const crearPedido = async (data) => {
    try {
      setLoading(true);

      // --- CAMBIO: PASAR AMBOS PARÁMETROS A LA VALIDACIÓN ---
      for (const item of data.items) {
        const validacion = validarStock(
          item.idProducto,
          item.cantidadSobres || 0,
          item.cantidadSticks || 0
        );

        if (!validacion.valido) {
          toast.error(validacion.mensaje);
          setLoading(false);
          return false;
        }
      }

      await pedidosApi.create(data);
      toast.success("Pedido creado correctamente");
      return true;
    } catch (err) {
      const errorMsg = err.response?.data || "Error al crear pedido";
      // Si el backend manda mensaje de error como string simple o JSON
      toast.error(
        typeof errorMsg === "object" ? JSON.stringify(errorMsg) : errorMsg
      );
      console.error("Error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    crearPedido,
    loading,
    cargarInventarioVendedor,
    inventarioDisponible,
    validarStock,
  };
};
