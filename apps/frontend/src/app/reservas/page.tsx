'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Reserva } from '@/types';
import styles from './reservas.module.css';
import Header from '@/components/Header/Header';

export default function ReservasPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loadingReservas, setLoadingReservas] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchReservas();
    }
  }, [loading, user, router]);

  const fetchReservas = async () => {
    try {
      const response = await api.get('/reservas');
      setReservas(response.data);
    } catch (error) {
      console.error('Error fetching reservas:', error);
    } finally {
      setLoadingReservas(false);
    }
  };

  const handleCancelReserva = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      try {
        await api.delete(`/reservas/${id}`);
        setReservas(prev => 
          prev.map(r => r.id_reserva === id ? { ...r, estado: 'CANCELADO' } : r)
        );
        alert('Reserva cancelada exitosamente');
      } catch (error) {
        alert('Error al cancelar la reserva');
      }
    }
  };

  if (loading || loadingReservas) {
    return (
      <div>
        <Header />
        <div className={styles.loading}>
          <div className="spinner"></div>
          <p>Cargando reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className="container">
          <div className={styles.header}>
            <h1>Mis Reservas</h1>
            <p>Gestiona todas tus reservas de tours</p>
          </div>

          {reservas.length === 0 ? (
            <div className={styles.emptyState}>
              <h2>No tienes reservas aún</h2>
              <p>¡Explora nuestros tours y haz tu primera reserva!</p>
              <button 
                onClick={() => router.push('/')}
                className="btn btn-primary"
              >
                Ver Tours Disponibles
              </button>
            </div>
          ) : (
            <div className={styles.reservasList}>
              {reservas.map((reserva) => (
                <div key={reserva.id_reserva} className={`card ${styles.reservaCard}`}>
                  <div className="card-body">
                    <div className={styles.reservaHeader}>
                      <h3>Reserva #{reserva.id_reserva}</h3>
                      <span className={`${styles.badge} ${styles[reserva.estado.toLowerCase()]}`}>
                        {reserva.estado}
                      </span>
                    </div>

                    <div className={styles.reservaDetails}>
                      <div className={styles.detailGroup}>
                        <strong>Tour:</strong> {reserva.tour_programado.tipo_tour.nombre}
                      </div>
                      <div className={styles.detailGroup}>
                        <strong>Fecha:</strong> {new Date(reserva.tour_programado.fecha).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className={styles.detailGroup}>
                        <strong>Horario:</strong> {reserva.tour_programado.horario.hora_inicio.slice(0, 5)} - {reserva.tour_programado.horario.hora_fin.slice(0, 5)}
                      </div>
                      <div className={styles.detailGroup}>
                        <strong>Embarcación:</strong> {reserva.tour_programado.embarcacion.nombre}
                      </div>
                      <div className={styles.detailGroup}>
                        <strong>Total:</strong> S/ {Number(reserva.total_pagar).toFixed(2)}
                      </div>
                      <div className={styles.detailGroup}>
                        <strong>Fecha de Reserva:</strong> {new Date(reserva.fecha_reserva).toLocaleDateString('es-ES')}
                      </div>
                    </div>

                    <div className={styles.pasajesInfo}>
                      <h4>Detalles de Pasajes:</h4>
                      {reserva.pasajes_cantidad.map((pasaje, index) => (
                        <div key={index} className={styles.pasajeItem}>
                          <span>{pasaje.tipo_pasaje.nombre}</span>
                          <span>Cantidad: {pasaje.cantidad}</span>
                          <span>S/ {Number(pasaje.tipo_pasaje.costo).toFixed(2)} c/u</span>
                        </div>
                      ))}
                    </div>

                    {reserva.notas && (
                      <div className={styles.notasSection}>
                        <strong>Notas:</strong>
                        <p>{reserva.notas}</p>
                      </div>
                    )}

                    <div className={styles.reservaActions}>
                      <button 
                        onClick={() => router.push(`/reservas/${reserva.id_reserva}`)}
                        className="btn btn-secondary"
                      >
                        Ver Detalles
                      </button>
                      {reserva.estado === 'RESERVADO' && (
                        <button 
                          onClick={() => handleCancelReserva(reserva.id_reserva)}
                          className="btn btn-danger"
                        >
                          Cancelar Reserva
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}