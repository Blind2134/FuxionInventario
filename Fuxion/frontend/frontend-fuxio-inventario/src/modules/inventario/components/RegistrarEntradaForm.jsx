import { useState } from "react";
import { FiPlus, FiTrash2, FiPackage } from "react-icons/fi";

const RegistrarEntradaForm = ({ socios, productos, onSubmit, loading }) => {
  const [idSocio, setIdSocio] = useState("");
  const [observacion, setObservacion] = useState("");
  const [items, setItems] = useState([
    { idProducto: "", cantidadSobres: 0, cantidadSticks: 0 },
  ]);

  const handleAddItem = () => {
    setItems([
      ...items,
      { idProducto: "", cantidadSobres: 0, cantidadSticks: 0 },
    ]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] =
      field === "idProducto" ? value : parseInt(value) || 0;
    setItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar
    if (!idSocio) {
      alert("Selecciona un socio");
      return;
    }

    const itemsValidos = items.filter(
      (item) =>
        item.idProducto && (item.cantidadSobres > 0 || item.cantidadSticks > 0)
    );

    if (itemsValidos.length === 0) {
      alert("Agrega al menos un producto con cantidad");
      return;
    }

    onSubmit({
      idSocio: parseInt(idSocio),
      idAlmacen: 1,
      observacion,
      productos: itemsValidos,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Seleccionar socio */}
      <div>
        <label className="label">Socio que envía *</label>
        <select
          value={idSocio}
          onChange={(e) => setIdSocio(e.target.value)}
          className="input"
          required
        >
          <option value="">Selecciona un socio</option>
          {socios.map((socio) => (
            <option key={socio.idUsuario} value={socio.idUsuario}>
              {socio.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de productos */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="label mb-0">Productos *</label>
          <button
            type="button"
            onClick={handleAddItem}
            className="btn btn-secondary text-sm"
          >
            <FiPlus className="inline mr-1" />
            Agregar Producto
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="card bg-gray-50 p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {/* Producto */}
                <div className="md:col-span-2">
                  <select
                    value={item.idProducto}
                    onChange={(e) =>
                      handleItemChange(index, "idProducto", e.target.value)
                    }
                    className="input"
                    required
                  >
                    <option value="">Selecciona producto</option>
                    {productos.map((prod) => (
                      <option key={prod.idProducto} value={prod.idProducto}>
                        {prod.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sobres */}
                <div>
                  <input
                    type="number"
                    placeholder="Sobres"
                    min="0"
                    value={item.cantidadSobres}
                    onChange={(e) =>
                      handleItemChange(index, "cantidadSobres", e.target.value)
                    }
                    className="input"
                  />
                </div>

                {/* Sticks */}
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Sticks"
                    min="0"
                    value={item.cantidadSticks}
                    onChange={(e) =>
                      handleItemChange(index, "cantidadSticks", e.target.value)
                    }
                    className="input flex-1"
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="btn bg-red-100 text-red-700 hover:bg-red-200 px-3"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Observación */}
      <div>
        <label className="label">Observación</label>
        <textarea
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
          className="input"
          rows="3"
          placeholder="Ej: Envío desde Lima por courier"
        />
      </div>

      {/* Botón submit */}
      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full"
      >
        <FiPackage className="inline mr-2" />
        {loading ? "Registrando..." : "Registrar Entrada"}
      </button>
    </form>
  );
};

export default RegistrarEntradaForm;
