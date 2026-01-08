const ProductoForm = ({
  formData,
  handleChange,
  handleSubmit,
  loading,
  isEdit = false,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre del producto */}
      <div>
        <label className="label">Nombre del Producto *</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="input"
          placeholder="Ej: Omnilife Supreme"
          required
        />
      </div>

      {/* Categoría y SKU */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Categoría</label>
          <input
            type="text"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="input"
            placeholder="Ej: Suplementos"
          />
        </div>

        <div>
          <label className="label">SKU</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className="input"
            placeholder="Ej: FUX-001"
          />
        </div>
      </div>

      {/* Sticks por sobre y Precio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Sticks por Sobre *</label>
          <input
            type="number"
            name="sticksPorSobre"
            value={formData.sticksPorSobre}
            onChange={handleChange}
            className="input"
            placeholder="Ej: 28"
            min="1"
            required
          />
        </div>

        <div>
          <label className="label">Precio Referencial (S/) *</label>
          <input
            type="number"
            name="precioReferencial"
            value={formData.precioReferencial}
            onChange={handleChange}
            className="input"
            placeholder="Ej: 120.00"
            step="0.01"
            min="0"
            required
          />
        </div>
      </div>

      {/* URL de imagen */}
      <div>
        <label className="label">URL de Imagen</label>
        <input
          type="url"
          name="imgUrl"
          value={formData.imgUrl}
          onChange={handleChange}
          className="input"
          placeholder="https://ejemplo.com/imagen.jpg"
        />
        {formData.imgUrl && (
          <div className="mt-2">
            <img
              src={formData.imgUrl}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-lg border border-gray-300"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary flex-1"
        >
          {loading
            ? "Guardando..."
            : isEdit
            ? "Actualizar Producto"
            : "Crear Producto"}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn btn-secondary"
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ProductoForm;
