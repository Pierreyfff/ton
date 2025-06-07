'use client';
import { useRouter } from 'next/navigation';
import { Tour, TourProgramado } from '@/types';
import styles from './TourCard.module.css';

interface TourCardProps {
  tour: Tour;
  tourProgramado?: TourProgramado;
}

export default function TourCard({ tour, tourProgramado }: TourCardProps) {
  const router = useRouter();

  const handleReservar = () => {
    if (tourProgramado) {
      router.push(`/reservar/${tourProgramado.id_tour_programado}`);
    } else {
      router.push(`/tours/${tour.id_tipo_tour}`);
    }
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5); // HH:MM
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`card ${styles.tourCard}`}>
      {tour.url_imagen && (
        <div className={styles.imageContainer}>
          <img 
            src={tour.url_imagen} 
            alt={tour.nombre}
            className={styles.image}
          />
        </div>
      )}
      
      <div className="card-body">
        <h3 className={styles.title}>{tour.nombre}</h3>
        {tour.descripcion && (
          <p className={styles.description}>{tour.descripcion}</p>
        )}
        
        <div className={styles.details}>
          <div className={styles.detail}>
            <span className={styles.detailLabel}>Duración:</span>
            <span>{tour.duracion_minutos} minutos</span>
          </div>
          <div className={styles.detail}>
            <span className={styles.detailLabel}>Capacidad:</span>
            <span>{tour.cantidad_pasajeros} personas</span>
          </div>
          <div className={styles.detail}>
            <span className={styles.detailLabel}>Ubicación:</span>
            <span>{tour.sede.distrito}</span>
          </div>
        </div>

        {tourProgramado && (
          <div className={styles.programmedInfo}>
            <div className={styles.dateInfo}>
              <strong>{formatDate(tourProgramado.fecha)}</strong>
            </div>
            <div className={styles.timeInfo}>
              {formatTime(tourProgramado.horario.hora_inicio)} - {formatTime(tourProgramado.horario.hora_fin)}
            </div>
            <div className={styles.availabilityInfo}>
              <span className={styles.available}>
                {tourProgramado.cupo_disponible} cupos disponibles
              </span>
            </div>
            <div className={styles.boatInfo}>
              Embarcación: {tourProgramado.embarcacion.nombre}
            </div>
          </div>
        )}

        <div className={styles.pricing}>
          {tour.tipos_pasaje && tour.tipos_pasaje.length > 0 && (
            <div className={styles.priceInfo}>
              <span className={styles.priceLabel}>Desde:</span>
              <span className={styles.price}>
                S/ {Math.min(...tour.tipos_pasaje.map(p => p.costo))}
              </span>
            </div>
          )}
        </div>

        <button 
          onClick={handleReservar}
          className={`btn btn-primary ${styles.reserveButton}`}
          disabled={tourProgramado && tourProgramado.cupo_disponible === 0}
        >
          {tourProgramado ? 'Reservar Ahora' : 'Ver Detalles'}
        </button>
      </div>
    </div>
  );
}