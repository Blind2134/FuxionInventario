import { useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiShoppingCart,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { inventarioApi } from "../../../api/enpoints/inventarioApi"; // Importamos API para cargar stock del prestamista

const CrearPedidoForm = ({
  vendedores, // Lista de todos los socios (para elegir prestamista)
  inventarioDisponible, // Stock del vendedor PRINCIPAL (ya formateado desde el padre)
  onSubmit,
  loading,
  onVendedorChange,
}) => {
  const [formData, setFormData] = useState({
    idVendedor: "",
    clienteNombre: "",
    clienteTelefono: "",
    clienteDireccion: "",
  });

  // CACHÉ DE INVENTARIOS: Guardamos los inventarios de los prestamistas para no recargar a cada rato
  // Estructura: { "idUsuario": [listaProductosFormateada], ... }
  const [inventariosPrestamo, setInventariosPrestamo] = useState({});

  const [items, setItems] = useState([
    {
      idProducto: "",
      cantidadSobres: 0,
      cantidadSticks: 0,
      esRegaloSobre: false,
      esRegaloStick: false,
      esPrestamo: false, // NUEVO: Bandera para saber si es prestado
      idPrestamista: "", // NUEVO: ID del socio que presta
    },
  ]);

  // --- FUNCIÓN HELPER: FORMATEAR INVENTARIO (Igual que en tu página principal) ---
  const formatearInventario = (listaCruda) => {
    return listaCruda.map((item) => {
      let infoStock = "";
      if (item.cantidadSobres > 0 && item.cantidadSticks > 0) {
        infoStock = `(${item.cantidadSobres} sobres) (${item.cantidadSticks} sticks)`;
      } else if (item.cantidadSobres > 0) {
        infoStock = `(${item.cantidadSobres} sobres)`;
      } else {
        infoStock = `(${item.cantidadSticks} sticks)`;
      }
      return {
        ...item,
        nombreProducto: `${item.nombreProducto} ${infoStock}`,
      };
    });
  };

  // --- NUEVO: CARGAR STOCK DEL PRESTAMISTA BAJO DEMANDA ---
  const cargarInventarioPrestamista = async (idPrestamista) => {
    // Si ya lo tenemos en caché o no hay ID, no hacemos nada
    if (!idPrestamista || inventariosPrestamo[idPrestamista]) return;

    try {
      const data = await inventarioApi.getBySocio(idPrestamista);
      const lista = data.productos || data || [];
      const listaFormateada = formatearInventario(lista); // Formateamos para que se vea bonito en el select

      setInventariosPrestamo((prev) => ({
        ...prev,
        [idPrestamista]: listaFormateada,
      }));
    } catch (error) {
      console.error("Error cargando inventario prestamista:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVendedorChange = (e) => {
    const idVendedor = e.target.value;
    setFormData({ ...formData, idVendedor });
    // Reiniciamos items al cambiar vendedor principal
    setItems([
      {
        idProducto: "",
        cantidadSobres: 0,
        cantidadSticks: 0,
        esRegaloSobre: false,
        esRegaloStick: false,
        esPrestamo: false,
        idPrestamista: "",
      },
    ]);
    if (onVendedorChange) {
      onVendedorChange(idVendedor);
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        idProducto: "",
        cantidadSobres: 0,
        cantidadSticks: 0,
        esRegaloSobre: false,
        esRegaloStick: false,
        esPrestamo: false,
        idPrestamista: "",
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    const currentItem = newItems[index];

    // LÓGICA DE PRÉSTAMOS
    if (field === "esPrestamo") {
      currentItem.esPrestamo = value; // Boolean
      if (!value) {
        // Si apaga el préstamo, limpiamos prestamista y producto para evitar mezclas
        currentItem.idPrestamista = "";
        currentItem.idProducto = "";
      }
    } else if (field === "idPrestamista") {
      currentItem.idPrestamista = value;
      currentItem.idProducto = ""; // Reseteamos producto porque la lista cambió
      if (value) cargarInventarioPrestamista(value); // Cargamos inventario si seleccionó alguien
    } else if (field === "idProducto") {
      currentItem.idProducto = value;
    } else if (field === "esRegaloSobre" || field === "esRegaloStick") {
      currentItem[field] = value;
    } else {
      currentItem[field] = parseInt(value) || 0;
    }

    setItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.idVendedor) {
      alert("Selecciona un vendedor");
      return;
    }

    const itemsValidos = items.filter(
      (item) =>
        item.idProducto && (item.cantidadSobres > 0 || item.cantidadSticks > 0)
    );

    if (itemsValidos.length === 0) {
      alert("Agrega al menos un producto con cantidad válida");
      return;
    }

    // PREPARAR DATOS PARA EL BACKEND
    // Mapeamos para incluir el idDuenoStock correcto
    const itemsParaEnviar = itemsValidos.map((item) => ({
      ...item,
      // Si es préstamo, el dueño es el prestamista. Si no, es el vendedor principal.
      idDuenoStock: item.esPrestamo
        ? parseInt(item.idPrestamista)
        : parseInt(formData.idVendedor),
    }));

    onSubmit({
      ...formData,
      idVendedor: parseInt(formData.idVendedor),
      items: itemsParaEnviar,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* SECCIÓN VENDEDOR Y CLIENTE (Igual que antes) */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Vendedor (Socio) *</label>
            <select
              name="idVendedor"
              value={formData.idVendedor}
              onChange={handleVendedorChange}
              className="input bg-white"
              required
            >
              <option value="">Selecciona un vendedor</option>
              {vendedores.map((vendedor) => (
                <option key={vendedor.idUsuario} value={vendedor.idUsuario}>
                  {vendedor.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Nombre del Cliente *</label>
            <input
              type="text"
              name="clienteNombre"
              value={formData.clienteNombre}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Teléfono *</label>
            <input
              type="tel"
              name="clienteTelefono"
              value={formData.clienteTelefono}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">Dirección *</label>
            <textarea
              name="clienteDireccion"
              value={formData.clienteDireccion}
              onChange={handleChange}
              className="input"
              rows="2"
              required
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN PRODUCTOS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="label mb-0 text-lg">Productos del Pedido</label>
          <button
            type="button"
            onClick={handleAddItem}
            className="btn btn-secondary text-sm"
            disabled={!formData.idVendedor}
          >
            <FiPlus className="inline mr-1" /> Agregar Producto
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => {
            // DETERMINAR QUÉ LISTA DE INVENTARIO USAR
            // Si es préstamo y hay prestamista seleccionado, usamos su lista.
            // Si no, usamos la del vendedor principal.
            const listaInventario =
              item.esPrestamo && item.idPrestamista
                ? inventariosPrestamo[item.idPrestamista] || []
                : inventarioDisponible;

            const producto = listaInventario.find(
              (p) => p.idProducto === parseInt(item.idProducto)
            );

            return (
              <div
                key={index}
                className={`card p-4 border shadow-sm transition-colors ${
                  item.esPrestamo
                    ? "bg-orange-50 border-orange-200"
                    : "bg-white"
                }`}
              >
                {/* CABECERA DEL ITEM: Switch de Préstamo */}
                <div className="flex justify-between items-center mb-3 border-b pb-2">
                  <span className="text-xs font-bold uppercase text-gray-500">
                    Item #{index + 1}
                  </span>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center cursor-pointer text-xs font-bold gap-1 select-none">
                      <input
                        type="checkbox"
                        checked={item.esPrestamo}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "esPrestamo",
                            e.target.checked
                          )
                        }
                        className="rounded text-orange-500 focus:ring-orange-500"
                        disabled={!formData.idVendedor}
                      />
                      <span
                        className={
                          item.esPrestamo ? "text-orange-600" : "text-gray-400"
                        }
                      >
                        ¿Es Préstamo?
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {/* FILA 1: Origen (si es préstamo) y Producto */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* SI ES PRÉSTAMO: Selector de Prestamista */}
                    {item.esPrestamo ? (
                      <div>
                        <label className="label text-orange-700 flex items-center gap-1">
                          <FiUsers /> Pedir Prestado a:
                        </label>
                        <select
                          value={item.idPrestamista}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "idPrestamista",
                              e.target.value
                            )
                          }
                          className="input border-orange-300 focus:border-orange-500 bg-white"
                        >
                          <option value="">-- Seleccionar Socio --</option>
                          {vendedores
                            .filter(
                              (v) =>
                                v.idUsuario !== parseInt(formData.idVendedor)
                            ) // No mostrarse a sí mismo
                            .map((v) => (
                              <option key={v.idUsuario} value={v.idUsuario}>
                                {v.nombre}
                              </option>
                            ))}
                        </select>
                      </div>
                    ) : (
                      // SI ES PROPIO: Mostrar indicador visual simple
                      <div className="hidden md:block">
                        <label className="label text-gray-500 flex items-center gap-1">
                          <FiUser /> Origen:
                        </label>
                        <div className="px-3 py-2 bg-gray-100 rounded text-gray-600 text-sm font-medium">
                          Stock Propio
                        </div>
                      </div>
                    )}

                    {/* SELECTOR DE PRODUCTO */}
                    <div className={!item.esPrestamo ? "md:col-span-1" : ""}>
                      <label className="label">
                        Producto ({listaInventario.length} disponibles)
                      </label>
                      <select
                        value={item.idProducto}
                        onChange={(e) =>
                          handleItemChange(index, "idProducto", e.target.value)
                        }
                        className="input w-full"
                        required
                        disabled={item.esPrestamo && !item.idPrestamista}
                      >
                        <option value="">
                          {item.esPrestamo && !item.idPrestamista
                            ? "<- Selecciona socio primero"
                            : "Selecciona producto"}
                        </option>
                        {listaInventario.map((prod) => (
                          <option key={prod.idProducto} value={prod.idProducto}>
                            {prod.nombreProducto}
                          </option>
                        ))}
                      </select>
                      {producto && (
                        <p className="text-xs text-gray-500 mt-1">
                          Stock: <b>{producto.cantidadSobres} cajas</b> /{" "}
                          <b>{producto.cantidadSticks} sticks</b>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* FILA 2: Inputs de Cantidad y Checkboxes (Igual que antes) */}
                  <div className="flex flex-wrap items-start gap-6 pt-2 border-t border-gray-100">
                    {/* GRUPO CAJAS (SOBRES) */}
                    <div className="flex flex-col items-center">
                      <label className="text-xs text-gray-600 font-bold mb-1">
                        CAJAS
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={item.cantidadSobres || ""}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "cantidadSobres",
                            e.target.value
                          )
                        }
                        className="input text-center w-20 mb-1"
                        placeholder="0"
                      />
                      <label className="flex items-center gap-1 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={item.esRegaloSobre}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "esRegaloSobre",
                              e.target.checked
                            )
                          }
                          className="w-3 h-3 text-blue-600 rounded"
                        />
                        <span
                          className={`text-xs ${
                            item.esRegaloSobre
                              ? "text-green-600 font-bold"
                              : "text-gray-400"
                          }`}
                        >
                          ¿Regalo?
                        </span>
                      </label>
                    </div>

                    {/* GRUPO STICKS */}
                    <div className="flex flex-col items-center">
                      <label className="text-xs text-gray-600 font-bold mb-1">
                        STICKS
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={item.cantidadSticks || ""}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "cantidadSticks",
                            e.target.value
                          )
                        }
                        className="input text-center w-20 mb-1"
                        placeholder="0"
                      />
                      <label className="flex items-center gap-1 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={item.esRegaloStick}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "esRegaloStick",
                              e.target.checked
                            )
                          }
                          className="w-3 h-3 text-blue-600 rounded"
                        />
                        <span
                          className={`text-xs ${
                            item.esRegaloStick
                              ? "text-green-600 font-bold"
                              : "text-gray-400"
                          }`}
                        >
                          ¿Regalo?
                        </span>
                      </label>
                    </div>

                    {/* Botón Eliminar */}
                    <div className="ml-auto mt-6">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-500 hover:text-red-700 p-2"
                          title="Eliminar fila"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full py-3 text-lg mt-4 shadow-lg"
      >
        <FiShoppingCart className="inline mr-2" />
        {loading ? "Procesando..." : "Confirmar Pedido"}
      </button>
    </form>
  );
};

export default CrearPedidoForm;
