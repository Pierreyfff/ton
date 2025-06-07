'use client';
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

        {/* Estadísticas */}
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

        {/* Reservas Recientes */}
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
}