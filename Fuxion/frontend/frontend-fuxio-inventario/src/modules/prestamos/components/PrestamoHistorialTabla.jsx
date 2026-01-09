import React, { useState, useMemo } from "react";
import { FiPrinter, FiFilter, FiX } from "react-icons/fi";

export const PrestamoHistorialTabla = ({ prestamos, onMarcarPagado }) => {
  const [filtroSocio, setFiltroSocio] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");

  // ========================================================================
  // OBTENER LISTA ÚNICA DE SOCIOS
  // ========================================================================
  const listaSocios = useMemo(() => {
    if (!prestamos) return [];
    const socios = new Set();
    prestamos.forEach((p) => {
      socios.add(p.nombreSocioDeudor);
      socios.add(p.nombreSocioAcreedor);
    });
    return Array.from(socios).sort();
  }, [prestamos]);

  // ========================================================================
  // FILTRAR PRÉSTAMOS
  // ========================================================================
  const prestamosFiltrados = useMemo(() => {
    if (!prestamos) return [];

    return prestamos.filter((p) => {
      // Filtro por socio
      const cumpleSocio =
        !filtroSocio ||
        p.nombreSocioDeudor.toLowerCase().includes(filtroSocio.toLowerCase()) ||
        p.nombreSocioAcreedor.toLowerCase().includes(filtroSocio.toLowerCase());

      // Filtro por estado
      const cumpleEstado =
        filtroEstado === "TODOS" || p.estado === filtroEstado;

      return cumpleSocio && cumpleEstado;
    });
  }, [prestamos, filtroSocio, filtroEstado]);

  // ========================================================================
  // FUNCIÓN PARA GENERAR PDF
  // ========================================================================
  const handleGenerarPDF = () => {
    const ventanaPDF = window.open("", "_blank");
    const fecha = new Date().toLocaleDateString();

    const contenidoHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Historial de Préstamos - ${fecha}</title>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #4F46E5;
            padding-bottom: 15px;
          }
          .header h1 {
            margin: 0;
            color: #4F46E5;
            font-size: 24px;
          }
          .header p {
            margin: 5px 0;
            color: #666;
            font-size: 12px;
          }
          .filtros-info {
            background: #F3F4F6;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background-color: #F9FAFB;
            border: 1px solid #E5E7EB;
            padding: 12px 8px;
            text-align: left;
            font-size: 11px;
            font-weight: 600;
            color: #374151;
          }
          td {
            border: 1px solid #E5E7EB;
            padding: 10px 8px;
            font-size: 11px;
          }
          tr:nth-child(even) {
            background-color: #F9FAFB;
          }
          .cantidad-box {
            display: inline-block;
            background: #DBEAFE;
            border: 1px solid #93C5FD;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            color: #1E40AF;
            font-size: 12px;
          }
          .cantidad-sticks {
            display: inline-block;
            padding: 4px 8px;
            font-weight: bold;
            color: #374151;
            font-size: 12px;
          }
          .estado-pendiente {
            background: #FEF3C7;
            color: #92400E;
            padding: 4px 8px;
            border-radius: 9999px;
            font-size: 10px;
            font-weight: 600;
            display: inline-block;
          }
          .estado-devuelto {
            background: #D1FAE5;
            color: #065F46;
            padding: 4px 8px;
            border-radius: 9999px;
            font-size: 10px;
            font-weight: 600;
            display: inline-block;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #9CA3AF;
            border-top: 1px solid #E5E7EB;
            padding-top: 15px;
          }
          .socio-info {
            font-size: 10px;
            line-height: 1.4;
          }
          .socio-label {
            font-weight: 600;
            color: #6B7280;
          }
          .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4F46E5;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 1000;
          }
          .print-button:hover {
            background: #4338CA;
          }
          @media print {
            .print-button { display: none; }
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <button class="print-button" onclick="window.print()">🖨️ Imprimir / Guardar como PDF</button>
        
        <div class="header">
          <h1>📋 HISTORIAL DE PRÉSTAMOS</h1>
          <p>Generado el: ${fecha}</p>
        </div>
        
        ${
          filtroSocio || filtroEstado !== "TODOS"
            ? `
          <div class="filtros-info">
            <strong>Filtros aplicados:</strong>
            ${filtroSocio ? `Socio: ${filtroSocio}` : ""}
            ${filtroSocio && filtroEstado !== "TODOS" ? " | " : ""}
            ${filtroEstado !== "TODOS" ? `Estado: ${filtroEstado}` : ""}
          </div>
        `
            : ""
        }
        
        <table>
          <thead>
            <tr>
              <th style="width: 80px;">Fecha</th>
              <th style="width: 150px;">Deudor / Acreedor</th>
              <th>Producto</th>
              <th style="width: 100px; text-align: center;">Cantidad</th>
              <th style="width: 80px; text-align: center;">Estado</th>
            </tr>
          </thead>
          <tbody>
            ${prestamosFiltrados
              .map(
                (p) => `
              <tr>
                <td>
                  ${new Date(p.fecha).toLocaleDateString()}
                  <div style="color: #9CA3AF; font-size: 9px;">ID: #${
                    p.idPrestamo
                  }</div>
                </td>
                <td>
                  <div class="socio-info">
                    <div><span class="socio-label">RECIBE:</span> ${
                      p.nombreSocioDeudor
                    }</div>
                    <div><span class="socio-label">PRESTA:</span> ${
                      p.nombreSocioAcreedor
                    }</div>
                  </div>
                </td>
                <td>
                  <strong>${p.nombreProducto}</strong>
                  ${
                    p.codigoPedido
                      ? `<div style="color: #3B82F6; font-size: 9px;">Ref: ${p.codigoPedido}</div>`
                      : ""
                  }
                </td>
                <td style="text-align: center;">
                  ${
                    p.cantidadSobres > 0
                      ? `<span class="cantidad-box">${p.cantidadSobres} Sobres</span>`
                      : ""
                  }
                  ${p.cantidadSobres > 0 && p.cantidadSticks > 0 ? " " : ""}
                  ${
                    p.cantidadSticks > 0
                      ? `<span class="cantidad-sticks">${p.cantidadSticks} Sticks</span>`
                      : ""
                  }
                </td>
                <td style="text-align: center;">
                  <span class="${
                    p.estado === "PENDIENTE"
                      ? "estado-pendiente"
                      : "estado-devuelto"
                  }">
                    ${p.estado}
                  </span>
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Total de registros: ${prestamosFiltrados.length}</p>
          <p>Sistema de Gestión de Inventario</p>
        </div>
      </body>
      </html>
    `;

    ventanaPDF.document.write(contenidoHTML);
    ventanaPDF.document.close();
  };

  // ========================================================================
  // FUNCIÓN DE RENDERIZADO VISUAL
  // ========================================================================
  const renderizarStockVisual = (item) => {
    const sobres = item.cantidadSobres || 0;
    const sticks = item.cantidadSticks || 0;

    if (sobres === 0 && sticks === 0) {
      return <span className="text-gray-300 text-xs font-bold">VACÍO (0)</span>;
    }

    return (
      <div className="flex items-center justify-center gap-2">
        {sobres > 0 && (
          <div className="flex flex-col items-center bg-blue-50 px-2 py-1 rounded border border-blue-200 shadow-sm">
            <span className="text-xl font-bold text-blue-700 leading-none">
              {sobres}
            </span>
            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
              Sobres
            </span>
          </div>
        )}

        {sobres > 0 && sticks > 0 && (
          <span className="text-gray-300 text-xl font-light">|</span>
        )}

        {sticks > 0 && (
          <div className="flex flex-col items-center px-2 py-1">
            <span className="text-xl font-bold text-gray-700 leading-none">
              {sticks}
            </span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              Sticks
            </span>
          </div>
        )}
      </div>
    );
  };

  if (!prestamos || prestamos.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No hay historial de préstamos registrado.
      </div>
    );
  }

  return (
    <div>
      {/* BARRA DE FILTROS Y ACCIONES */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* FILTROS */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Filtro por Socio */}
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-400" />
              <input
                type="text"
                placeholder="Buscar socio..."
                value={filtroSocio}
                onChange={(e) => setFiltroSocio(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {filtroSocio && (
                <button
                  onClick={() => setFiltroSocio("")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX />
                </button>
              )}
            </div>

            {/* Filtro por Estado */}
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="TODOS">Todos los estados</option>
              <option value="PENDIENTE">Pendientes</option>
              <option value="DEVUELTO">Devueltos</option>
            </select>

            {/* Contador de resultados */}
            <span className="text-sm text-gray-600">
              {prestamosFiltrados.length} de {prestamos.length} registros
            </span>
          </div>

          {/* BOTÓN PARA GENERAR PDF */}
          <button
            onClick={handleGenerarPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <FiPrinter />
            Generar PDF
          </button>
        </div>
      </div>

      {/* TABLA */}
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                Fecha
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Deudor / Acreedor
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Producto
              </th>
              <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                Cantidad
              </th>
              <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                Estado
              </th>
              <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {prestamosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  No se encontraron préstamos con los filtros aplicados
                </td>
              </tr>
            ) : (
              prestamosFiltrados.map((p) => (
                <tr
                  key={p.idPrestamo}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* FECHA */}
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500">
                    {new Date(p.fecha).toLocaleDateString()}
                    <div className="text-xs text-gray-400">
                      ID: #{p.idPrestamo}
                    </div>
                  </td>

                  {/* SOCIOS */}
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 text-xs">
                        RECIBE:
                      </span>
                      <span className="text-gray-700 mb-1">
                        {p.nombreSocioDeudor}
                      </span>
                      <span className="font-bold text-gray-400 text-xs">
                        PRESTA:
                      </span>
                      <span className="text-gray-500">
                        {p.nombreSocioAcreedor}
                      </span>
                    </div>
                  </td>

                  {/* PRODUCTO */}
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="font-medium text-gray-900">
                      {p.nombreProducto}
                    </div>
                    {p.codigoPedido && (
                      <div className="text-xs text-blue-500 bg-blue-50 inline-block px-1 rounded mt-1">
                        Ref: {p.codigoPedido}
                      </div>
                    )}
                  </td>

                  {/* CANTIDAD */}
                  <td className="whitespace-nowrap px-3 py-4 text-center">
                    {renderizarStockVisual(p)}
                  </td>

                  {/* ESTADO */}
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 
                      ${
                        p.estado === "PENDIENTE"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {p.estado}
                    </span>
                  </td>

                  {/* ACCIONES */}
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    {p.estado === "PENDIENTE" ? (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `¿Confirmar devolución completa de: ${p.nombreProducto}?`
                            )
                          ) {
                            onMarcarPagado(p.idPrestamo);
                          }
                        }}
                        className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded text-xs shadow-sm transition-all"
                      >
                        Marcar Devuelto
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs flex items-center justify-end gap-1">
                        ✓ Completado
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
