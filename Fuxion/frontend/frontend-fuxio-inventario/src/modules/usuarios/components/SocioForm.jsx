import { FiUser, FiMail, FiPhone, FiLock, FiShield } from "react-icons/fi";

const SocioForm = ({
  formData,
  handleChange,
  handleSubmit,
  loading,
  roles,
  isEdit = false,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre completo */}
      <div>
        <label className="label">
          <FiUser className="inline mr-2" />
          Nombre Completo *
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="input"
          placeholder="Ej: Juan Pérez García"
          required
        />
      </div>

      {/* Email y Teléfono */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">
            <FiMail className="inline mr-2" />
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input"
            placeholder="ejemplo@correo.com"
            required
          />
        </div>

        <div>
          <label className="label">
            <FiPhone className="inline mr-2" />
            Teléfono
          </label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="input"
            placeholder="999888777"
            maxLength="9"
          />
        </div>
      </div>

      {/* Password (solo al crear) */}
      {!isEdit && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">
              <FiLock className="inline mr-2" />
              Contraseña *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              placeholder="Mínimo 6 caracteres"
              minLength="6"
              required
            />
          </div>

          <div>
            <label className="label">
              <FiLock className="inline mr-2" />
              Confirmar Contraseña *
            </label>
            <input
              type="password"
              name="confirmarPassword"
              value={formData.confirmarPassword}
              onChange={handleChange}
              className="input"
              placeholder="Repite la contraseña"
              minLength="6"
              required
            />
          </div>
        </div>
      )}

      {/* Rol */}
      <div>
        <label className="label">
          <FiShield className="inline mr-2" />
          Rol *
        </label>
        <select
          name="idRol"
          value={formData.idRol}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="">Selecciona un rol</option>
          {roles.map((rol) => (
            <option key={rol.idRol} value={rol.idRol}>
              {rol.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Estado (solo al editar) */}
      {isEdit && (
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            name="activo"
            checked={formData.activo}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            id="activo"
          />
          <label
            htmlFor="activo"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Usuario activo
          </label>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-4 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary flex-1"
        >
          {loading
            ? "Guardando..."
            : isEdit
            ? "Actualizar Socio"
            : "Crear Socio"}
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

export default SocioForm;
