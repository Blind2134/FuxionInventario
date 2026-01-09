import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PedidosPorEstadoChart = ({ data }) => {
  // Aseguramos que data sea un array, si viene nulo usamos array vacío
  const chartData = data || [];

  // Colores para los estados: Pendiente (Amarillo), Pagado/Entregado (Verde), Cancelado (Rojo), Otros (Azul)
  const COLORS = ["#F59E0B", "#10B981", "#EF4444", "#3B82F6"];

  return (
    <div className="card h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Estado de Pedidos
      </h3>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="cantidad"
              nameKey="estado"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [value, "Pedidos"]}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PedidosPorEstadoChart;
