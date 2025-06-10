/*'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Reserva } from '@/types';
import styles from './dashboard.module.css';
import DashboardLayout from '@/components/DashboardLayout/DashboardLayout';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [stats, setStats] = useState({
    totalReservas: 0,
    reservasHoy: 0,
    ingresosMes: 0,
    reservasPendientes: 0
  });

  useEffect(() => {
    if (!loading && (!user || (user.rol !== 'ADMIN' && user.rol !== 'VENDEDOR'))) {
      router.push('/');
      return;
    }

    if (user) {
      fetchData();
    }
  }, [loading, user, router]);

  const fetchData = async () => {
    try {
      const [reservasResponse] = await Promise.all([
        api.get('/reservas'),
      ]);

      const reservasData = reservasResponse.data;
      setReservas(reservasData);

      // Calcular estadísticas
      const today = new Date().toISOString().split('T')[0];
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const reservasHoy = reservasData.filter((r: Reserva) => 
        r.fecha_reserva.split('T')[0] === today
      ).length;

      const ingresosMes = reservasData
        .filter((r: Reserva) => {
          const reservaDate = new Date(r.fecha_reserva);
          return reservaDate.getMonth() === currentMonth && 
                 reservaDate.getFullYear() === currentYear &&
                 r.estado !== 'CANCELADO';
        })
        .reduce((sum: number, r: Reserva) => sum + Number(r.total_pagar), 0);

      const reservasPendientes = reservasData.filter((r: Reserva) => 
        r.estado === 'RESERVADO'
      ).length;

      setStats({
        totalReservas: reservasData.length,
        reservasHoy,
        ingresosMes,
        reservasPendientes
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return (
      <DashboardLayout>
        <div className={styles.loading}>
          <div className="spinner"></div>
          <p>Cargando dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <h1>Dashboard</h1>
          <p>Bienvenido, {user?.nombres} {user?.apellidos}</p>
        </div>

        {}
        <div className="grid grid-cols-4">
          <div className={`card ${styles.statCard}`}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statContent}>
              <h3>Total Reservas</h3>
              <p className={styles.statNumber}>{stats.totalReservas}</p>
            </div>
          </div>
          
          <div className={`card ${styles.statCard}`}>
            <div className={styles.statIcon}>📅</div>
            <div className={styles.statContent}>
              <h3>Reservas Hoy</h3>
              <p className={styles.statNumber}>{stats.reservasHoy}</p>
            </div>
          </div>
          
          <div className={`card ${styles.statCard}`}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statContent}>
              <h3>Ingresos del Mes</h3>
              <p className={styles.statNumber}>S/ {stats.ingresosMes.toFixed(2)}</p>
            </div>
          </div>
          
          <div className={`card ${styles.statCard}`}>
            <div className={styles.statIcon}>⏳</div>
            <div className={styles.statContent}>
              <h3>Pendientes</h3>
              <p className={styles.statNumber}>{stats.reservasPendientes}</p>
            </div>
          </div>
        </div>

        {}
        <div className="card">
          <div className="card-header">
            <h2>Reservas Recientes</h2>
          </div>
          <div className="card-body">
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Tour</th>
                    <th>Fecha Tour</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.slice(0, 10).map((reserva) => (
                    <tr key={reserva.id_reserva}>
                      <td>#{reserva.id_reserva}</td>
                      <td>{reserva.cliente.nombres} {reserva.cliente.apellidos}</td>
                      <td>{reserva.tour_programado.tipo_tour.nombre}</td>
                      <td>
                        {new Date(reserva.tour_programado.fecha).toLocaleDateString('es-ES')}
                      </td>
                      <td>S/ {Number(reserva.total_pagar).toFixed(2)}</td>
                      <td>
                        <span className={`${styles.badge} ${styles[reserva.estado.toLowerCase()]}`}>
                          {reserva.estado}
                        </span>
                      </td>
                      <td>
                        <button 
                          onClick={() => router.push(`/dashboard/reservas/${reserva.id_reserva}`)}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className={styles.tableFooter}>
              <button 
                onClick={() => router.push('/dashboard/reservas')}
                className="btn btn-primary"
              >
                Ver Todas las Reservas
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}*/

'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Reserva } from '@/types';
import styles from './dashboard.module.css';
import DashboardLayout from '@/components/DashboardLayout/DashboardLayout';

interface DashboardStats {
  totalReservas: number;
  reservasHoy: number;
  ingresosMes: number;
  reservasPendientes: number;
  toursActivos: number;
  clientesRegistrados: number;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalReservas: 0,
    reservasHoy: 0,
    ingresosMes: 0,
    reservasPendientes: 0,
    toursActivos: 0,
    clientesRegistrados: 0
  });

  useEffect(() => {
    if (!loading && (!user || (user.rol !== 'ADMIN' && user.rol !== 'VENDEDOR'))) {
      router.push('/');
      return;
    }

    if (user) {
      fetchData();
    }
  }, [loading, user, router]);

  const fetchData = async () => {
    try {
      const [reservasResponse, dashboardResponse] = await Promise.all([
        api.get('/reservas'),
        api.get('/dashboard/stats')
      ]);

      const reservasData = reservasResponse.data;
      setReservas(reservasData);

      // Si existe endpoint de stats, usar esos datos
      if (dashboardResponse.data) {
        setStats(dashboardResponse.data);
      } else {
        // Calcular estadísticas manualmente
        const today = new Date().toISOString().split('T')[0];
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const reservasHoy = reservasData.filter((r: Reserva) => 
          r.fecha_reserva.split('T')[0] === today
        ).length;

        const ingresosMes = reservasData
          .filter((r: Reserva) => {
            const reservaDate = new Date(r.fecha_reserva);
            return reservaDate.getMonth() === currentMonth && 
                   reservaDate.getFullYear() === currentYear &&
                   r.estado !== 'CANCELADO';
          })
          .reduce((sum: number, r: Reserva) => sum + Number(r.total_pagar), 0);

        const reservasPendientes = reservasData.filter((r: Reserva) => 
          r.estado === 'RESERVADO'
        ).length;

        setStats({
          totalReservas: reservasData.length,
          reservasHoy,
          ingresosMes,
          reservasPendientes,
          toursActivos: 0,
          clientesRegistrados: 0
        });
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return (
      <DashboardLayout>
        <div className={styles.loading}>
          <div className="spinner"></div>
          <p>Cargando dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <h1>Dashboard</h1>
          <p>Bienvenido, {user?.nombres} {user?.apellidos}</p>
        </div>

        {/* Estadísticas Mejoradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                    {stats.totalReservas}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📅</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Reservas Hoy
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.reservasHoy}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">💰</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Ingresos del Mes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    S/ {stats.ingresosMes.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">⏳</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pendientes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.reservasPendientes}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard/reservas/nueva')}
                className="w-full btn btn-primary text-left"
              >
                + Nueva Reserva
              </button>
              <button
                onClick={() => router.push('/dashboard/tours-programados')}
                className="w-full btn btn-secondary text-left"
              >
                📅 Programar Tour
              </button>
              <button
                onClick={() => router.push('/dashboard/reportes')}
                className="w-full btn btn-outline text-left"
              >
                📊 Ver Reportes
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Estado del Sistema</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tours Activos</span>
                <span className="text-sm font-medium text-green-600">
                  {stats.toursActivos || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Clientes Registrados</span>
                <span className="text-sm font-medium text-blue-600">
                  {stats.clientesRegistrados || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estado del Servidor</span>
                <span className="text-sm font-medium text-green-600">En línea</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Enlaces Útiles</h3>
            <div className="space-y-3">
              <a
                href="/dashboard/clientes"
                className="block text-sm text-indigo-600 hover:text-indigo-900"
              >
                👥 Gestionar Clientes
              </a>
              <a
                href="/dashboard/embarcaciones"
                className="block text-sm text-indigo-600 hover:text-indigo-900"
              >
                🚤 Gestionar Embarcaciones
              </a>
              <a
                href="/dashboard/usuarios"
                className="block text-sm text-indigo-600 hover:text-indigo-900"
              >
                👤 Gestionar Usuarios
              </a>
            </div>
          </div>
        </div>

        {/* Reservas Recientes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Reservas Recientes</h2>
              <button
                onClick={() => router.push('/dashboard/reservas')}
                className="text-sm text-indigo-600 hover:text-indigo-900"
              >
                Ver todas →
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Tour
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservas.slice(0, 8).map((reserva) => (
                  <tr key={reserva.id_reserva} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{reserva.id_reserva}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {reserva.cliente.nombres} {reserva.cliente.apellidos}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reserva.cliente.correo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {reserva.tour_programado.tipo_tour.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(reserva.tour_programado.fecha).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      S/ {Number(reserva.total_pagar).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        reserva.estado === 'CONFIRMADO' ? 'bg-green-100 text-green-800' :
                        reserva.estado === 'RESERVADO' ? 'bg-yellow-100 text-yellow-800' :
                        reserva.estado === 'COMPLETADO' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {reserva.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => router.push(`/dashboard/reservas/${reserva.id_reserva}`)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {reservas.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay reservas recientes
              </h3>
              <p className="text-gray-500">
                Las nuevas reservas aparecerán aquí
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}