'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Tour, TourProgramado } from '@/types';
import styles from './page.module.css';
import Header from '@/components/Header/Header';
import TourCard from '@/components/TourCard/TourCard';
import SearchForm from '@/components/SearchForm/SearchForm';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);
  const [toursDisponibles, setToursDisponibles] = useState<TourProgramado[]>([]);
  const [loadingTours, setLoadingTours] = useState(true);

  useEffect(() => {
    if (!loading && user && (user.rol === 'ADMIN' || user.rol === 'VENDEDOR')) {
      router.push('/dashboard');
      return;
    }
    
    fetchTours();
  }, [loading, user, router]);

  const fetchTours = async () => {
    try {
      const response = await api.get('/tours');
      setTours(response.data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoadingTours(false);
    }
  };

  const handleSearch = async (fecha: string) => {
    try {
      setLoadingTours(true);
      const response = await api.get(`/tours/available?fecha=${fecha}`);
      setToursDisponibles(response.data);
    } catch (error) {
      console.error('Error searching tours:', error);
    } finally {
      setLoadingTours(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Descubre las Islas Ballestas
              </h1>
              <p className={styles.heroSubtitle}>
                Vive una experiencia única navegando por las hermosas Islas Ballestas, 
                hogar de lobos marinos, pingüinos y una gran variedad de aves marinas.
              </p>
              
              <SearchForm onSearch={handleSearch} />
            </div>
          </div>
        </section>

        {/* Tours Section */}
        <section className={styles.toursSection}>
          <div className="container">
            <h2 className={styles.sectionTitle}>
              {toursDisponibles.length > 0 ? 'Tours Disponibles' : 'Nuestros Tours'}
            </h2>
            
            {loadingTours ? (
              <div className={styles.loading}>
                <div className="spinner"></div>
                <p>Cargando tours...</p>
              </div>
            ) : (
              <div className="grid grid-cols-3">
                {toursDisponibles.length > 0 ? (
                  toursDisponibles.map((tourProgramado) => (
                    <TourCard 
                      key={tourProgramado.id_tour_programado}
                      tour={tourProgramado.tipo_tour}
                      tourProgramado={tourProgramado}
                    />
                  ))
                ) : (
                  tours.map((tour) => (
                    <TourCard key={tour.id_tipo_tour} tour={tour} />
                  ))
                )}
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <div className="container">
            <h2 className={styles.sectionTitle}>¿Por qué elegirnos?</h2>
            <div className="grid grid-cols-3">
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🛥️</div>
                <h3>Embarcaciones Seguras</h3>
                <p>Contamos con lanchas modernas y seguras para tu comodidad</p>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>👨‍✈️</div>
                <h3>Guías Expertos</h3>
                <p>Nuestros guías conocen cada rincón de las islas</p>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🌊</div>
                <h3>Experiencia Única</h3>
                <p>Vive momentos inolvidables en un paraíso natural</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <p>&copy; 2024 TON - Tours Islas Ballestas. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}