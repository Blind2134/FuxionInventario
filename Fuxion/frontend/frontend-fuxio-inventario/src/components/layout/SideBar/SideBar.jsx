import { NavLink } from "react-router-dom";
// 1. AÑADIDO: FiGrid a la lista de imports
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiArchive,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiGrid,
  FiRepeat,
} from "react-icons/fi";

const Sidebar = () => {
  const menuItems = [
    { path: "/", icon: FiHome, label: "Dashboard" },
    { path: "/productos", icon: FiPackage, label: "Productos" },
    { path: "/inventario", icon: FiArchive, label: "Inventario" },
    { path: "/pedidos", icon: FiShoppingCart, label: "Pedidos" },
    {
      path: "/pedidos/tablero",
      icon: FiGrid, // 2. CORREGIDO: Pasamos la referencia, no <FiGrid />
      label: "Tablero Estados",
    },
    {
      path: "/pedidos/por-vendedor",
      icon: FiUsers, // 2. CORREGIDO: Pasamos la referencia, no <FiUsers />
      label: "Ventas por Socio",
    },

    { path: "/prestamos", icon: FiRepeat, label: "Préstamos" },
    { path: "/usuarios", icon: FiUsers, label: "Socios" },
    { path: "/reportes", icon: FiBarChart2, label: "Reportes" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-lg">
      {/* Header con Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-200">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
          <FiPackage className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">FuxionStock</h1>
          <p className="text-xs text-gray-500">Sistema de Gestión</p>
        </div>
      </div>

      {/* Menú de Navegación */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Aquí es donde React usa la referencia para crear el icono */}
                  <item.icon
                    size={20}
                    className={
                      isActive
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-600"
                    }
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer del Sidebar */}
      <div className="border-t border-gray-200 p-4">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-200">
          <FiSettings size={20} className="text-gray-400" />
          <span>Configuración</span>
        </button>

        <div className="mt-2 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-semibold">
            U
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Usuario Demo</p>
            <p className="text-xs text-gray-500">demo@fuxion.com</p>
          </div>
          <button className="text-gray-400 hover:text-red-500 transition-colors">
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
