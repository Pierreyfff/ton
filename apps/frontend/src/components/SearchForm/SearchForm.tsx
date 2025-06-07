'use client';
import { useState } from 'react';
import styles from './SearchForm.module.css';

interface SearchFormProps {
  onSearch: (fecha: string) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [fecha, setFecha] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fecha) {
      onSearch(fecha);
    }
  };

  // Obtener fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <div className={styles.inputGroup}>
        <label htmlFor="fecha" className={styles.label}>
          Fecha del tour
        </label>
        <input
          type="date"
          id="fecha"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          min={today}
          className={styles.input}
          required
        />
      </div>
      <button type="submit" className={`btn btn-primary ${styles.searchButton}`}>
        Buscar Tours
      </button>
    </form>
  );
}