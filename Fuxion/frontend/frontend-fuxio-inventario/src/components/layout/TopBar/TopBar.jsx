import { FiBell, FiSearch } from "react-icons/fi";

const Topbar = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Buscador */}
      <div className="flex-1 max-w-xl"></div>

      {/* Acciones */}
      <div className="flex items-center gap-4">
        {/* Notificaciones */}
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <FiBell size={22} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Fecha actual */}
        <div className="text-sm text-gray-600">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
