// src/modules/dashboard/components/VentasChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const VentasChart = ({ data, titulo = "Ventas Últimos 7 Días" }) => {
  // Formatear datos para el gráfico
  const chartData =
    data?.map((item) => ({
      fecha: new Date(item.fecha).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
      }),
      monto: item.monto,
    })) || [];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{titulo}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="fecha" tick={{ fontSize: 12 }} stroke="#6b7280" />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
            tickFormatter={(value) => `S/ ${value}`}
          />
          <Tooltip
            formatter={(value) => [`S/ ${value.toFixed(2)}`, "Ventas"]}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="monto"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: "#3b82f6", r: 4 }}
            activeDot={{ r: 6 }}
            name="Ventas (S/)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VentasChart;
