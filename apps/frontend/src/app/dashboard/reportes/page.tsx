'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout/DashboardLayout';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';

interface Analytics {
  resumen: {
    totalReservas: number;
    ingresoTotal: number;
    promedioReserva: number;
  };
  reservasPorEstado: Array<{
    estado: string;
    _count: { _all: number };
  }>;
  ventasPorDia: Array<{
    fecha_reserva: string;
    _count: { _all: number };
    _sum: { total_pagar: number };
  }>;
  toursMasVendidos: Array<{
    nombre: string;
    count: number;
    total: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function ReportesPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Inicializar fechas (últimos 30 días)
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    setFechaFin(today.toISOString().split('T')[0]);
    setFechaInicio(thirtyDaysAgo.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      fetchAnalytics();
    }
  }, [fechaInicio, fechaFin]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reportes/analytics', {
        params: {
          fechaInicio,
          fechaFin,
          // ✅ Corregir acceso a sede
          ...(user?.sede?.id_sede && { sedeId: user.sede.id_sede }),
        },
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const descargarPDF = async () => {
    try {
      const response = await api.get('/reportes/ventas/pdf', {
        params: {
          fechaInicio,
          fechaFin,
          // ✅ Corregir acceso a sede
          ...(user?.sede?.id_sede && { sedeId: user.sede.id_sede }),
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-ventas-${fechaInicio}-${fechaFin}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error al descargar el reporte PDF');
    }
  };

  const descargarExcel = async () => {
    try {
      const response = await api.get('/reportes/ventas/excel', {
        params: {
          fechaInicio,
          fechaFin,
          // ✅ Corregir acceso a sede
          ...(user?.sede?.id_sede && { sedeId: user.sede.id_sede }),
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-ventas-${fechaInicio}-${fechaFin}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading Excel:', error);
      alert('Error al descargar el reporte Excel');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="spinner"></div>
          <span className="ml-3">Cargando reportes...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reportes y Analytics</h1>
            <p className="mt-1 text-sm text-gray-500">
              Análisis de ventas y estadísticas del negocio
            </p>
          </div>
        </div>

        {/* Filtros de Fecha */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Fin
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={descargarPDF}
                className="btn btn-secondary"
              >
                📄 PDF
              </button>
              <button
                onClick={descargarExcel}
                className="btn btn-secondary"
              >
                📊 Excel
              </button>
            </div>
          </div>
        </div>

        {analytics && (
          <>
            {/* Tarjetas de Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-bold">📊</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Reservas
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {analytics.resumen.totalReservas}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-bold">💰</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Ingresos Totales
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          S/ {analytics.resumen.ingresoTotal.toFixed(2)}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-bold">📈</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Promedio por Reserva
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          S/ {analytics.resumen.promedioReserva.toFixed(2)}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Reservas por Estado */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Reservas por Estado
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analytics.reservasPorEstado.map(item => ({
                        name: item.estado,
                        value: item._count._all,
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      // ✅ Corregir tipos any
                      label={({ name, percent }: { name: string; percent: number }) => 
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.reservasPorEstado.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Tours Más Vendidos */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Tours Más Vendidos
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analytics.toursMasVendidos.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="nombre" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Ventas por Día */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Ventas por Día
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart 
                    data={analytics.ventasPorDia.map(item => ({
                      fecha: new Date(item.fecha_reserva).toLocaleDateString(),
                      reservas: item._count._all,
                      ingresos: item._sum.total_pagar || 0,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="reservas" fill="#8884d8" name="Reservas" />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="ingresos" 
                      stroke="#82ca9d" 
                      name="Ingresos (S/)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}