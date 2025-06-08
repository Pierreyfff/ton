'use client';
import { useState } from 'react';
import { Calendar, Users, Search } from 'lucide-react';
import styles from './SearchForm.module.css';

interface SearchFormProps {
  onSearch: (date: string, passengers: number) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(2);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    
    setLoading(true);
    try {
      await onSearch(date, passengers);
    } finally {
      setLoading(false);
    }
  };

  // Obtener fecha mínima (hoy)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Obtener fecha máxima (30 días desde hoy)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <div className={styles.searchGrid}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <Calendar className={styles.inputIcon} />
            Fecha del Tour
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={getMinDate()}
            max={getMaxDate()}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <Users className={styles.inputIcon} />
            Pasajeros
          </label>
          <select
            value={passengers}
            onChange={(e) => setPassengers(parseInt(e.target.value))}
            className={styles.input}
          >
            {[...Array(20)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i + 1 === 1 ? 'persona' : 'personas'}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.buttonGroup}>
          <button 
            type="submit" 
            className={styles.searchButton}
            disabled={loading || !date}
          >
            {loading ? (
              <div className={styles.spinner}></div>
            ) : (
              <>
                <Search className={styles.buttonIcon} />
                Buscar Tours
              </>
            )}
          </button>
        </div>
      </div>

      <div className={styles.searchInfo}>
        <p>🌊 Tours disponibles todos los días desde las 7:30 AM</p>
        <p>⏰ Duración: 2 - 2.5 horas aproximadamente</p>
        <p>🎫 Reserva con anticipación para garantizar tu lugar</p>
      </div>
    </form>
  );
}