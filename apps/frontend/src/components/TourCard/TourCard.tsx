'use client';
import { useRouter } from 'next/navigation';
import { Tour, TourProgramado } from '@/types';
import { Clock, Users, MapPin, Calendar, Star } from 'lucide-react';
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
      day: 'numeric',
      month: 'long'
    });
  };

  const getMinPrice = () => {
    if (tour.tipos_pasaje && tour.tipos_pasaje.length > 0) {
      return Math.min(...tour.tipos_pasaje.map(p => p.costo));
    }
    return 0;
  };

  const isLowAvailability = tourProgramado && tourProgramado.cupo_disponible <= 5;
  const isSoldOut = tourProgramado && tourProgramado.cupo_disponible === 0;

  return (
    <div className={`${styles.tourCard} ${isSoldOut ? styles.soldOut : ''}`}>
      <div className={styles.imageContainer}>
        <img 
          src={tour.url_imagen || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80'} 
          alt={tour.nombre}
          className={styles.image}
        />
        
        {tourProgramado && (
          <div className={styles.badgeContainer}>
            {isSoldOut ? (
              <span className={`${styles.badge} ${styles.soldOutBadge}`}>
                Agotado
              </span>
            ) : isLowAvailability ? (
              <span className={`${styles.badge} ${styles.lowStockBadge}`}>
                ¡Últimos cupos!
              </span>
            ) : (
              <span className={`${styles.badge} ${styles.availableBadge}`}>
                Disponible
              </span>
            )}
          </div>
        )}
        
        <div className={styles.priceTag}>
          <span className={styles.priceLabel}>Desde</span>
          <span className={styles.price}>S/ {getMinPrice()}</span>
        </div>
      </div>
      
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>{tour.nombre}</h3>
          <div className={styles.rating}>
            <Star className={styles.starIcon} fill="currentColor" />
            <span>4.8</span>
          </div>
        </div>

        {tour.descripcion && (
          <p className={styles.description}>{tour.descripcion}</p>
        )}
        
        <div className={styles.details}>
          <div className={styles.detail}>
            <Clock className={styles.detailIcon} />
            <span>{tour.duracion_minutos} min</span>
          </div>
          <div className={styles.detail}>
            <Users className={styles.detailIcon} />
            <span>Hasta {tour.cantidad_pasajeros} personas</span>
          </div>
          <div className={styles.detail}>
            <MapPin className={styles.detailIcon} />
            <span>{tour.sede?.distrito || 'Paracas'}</span>
          </div>
        </div>

        {tourProgramado && (
          <div className={styles.programmedInfo}>
            <div className={styles.dateTimeInfo}>
              <div className={styles.dateInfo}>
                <Calendar className={styles.detailIcon} />
                <span className={styles.dateText}>
                  {formatDate(tourProgramado.fecha)}
                </span>
              </div>
              <div className={styles.timeInfo}>
                <Clock className={styles.detailIcon} />
                <span>
                  {formatTime(tourProgramado.horario.hora_inicio)} - {formatTime(tourProgramado.horario.hora_fin)}
                </span>
              </div>
            </div>
            
            <div className={styles.availabilityInfo}>
              <div className={styles.boatInfo}>
                <strong>Embarcación:</strong> {tourProgramado.embarcacion.nombre}
              </div>
              <div className={styles.capacityInfo}>
                <Users className={styles.detailIcon} />
                <span className={isLowAvailability ? styles.lowStock : ''}>
                  {tourProgramado.cupo_disponible} cupos disponibles
                </span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.cardActions}>
          <button 
            onClick={handleReservar}
            className={`${styles.reserveButton} ${isSoldOut ? styles.disabledButton : ''}`}
            disabled={isSoldOut}
          >
            {isSoldOut ? 'Agotado' : tourProgramado ? 'Reservar Ahora' : 'Ver Horarios'}
          </button>
          
          {!tourProgramado && (
            <button 
              onClick={() => router.push(`/tours/${tour.id_tipo_tour}`)}
              className={styles.detailsButton}
            >
              Ver Detalles
            </button>
          )}
        </div>
      </div>
    </div>
  );
}