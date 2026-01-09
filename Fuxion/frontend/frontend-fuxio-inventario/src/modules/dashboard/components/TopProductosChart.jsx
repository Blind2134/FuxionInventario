// src/modules/dashboard/components/TopProductosChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TopProductosChart = ({ data }) => {
  const chartData =
    data?.map((item) => ({
      nombre:
        item.nombreProducto.length > 15
          ? item.nombreProducto.substring(0, 15) + "..."
          : item.nombreProducto,
      cantidad: item.cantidadVendida,
    })) || [];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Top 5 Productos Más Vendidos
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="nombre"
            tick={{ fontSize: 11 }}
            stroke="#6b7280"
            angle={-15}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
          <Tooltip
            formatter={(value) => [value, "Unidades Vendidas"]}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Bar
            dataKey="cantidad"
            fill="#10b981"
            radius={[8, 8, 0, 0]}
            name="Unidades"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopProductosChart;
