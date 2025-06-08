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
import { Calendar, Clock, Users, Star, MapPin, Phone, Mail } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);
  const [toursDisponibles, setToursDisponibles] = useState<TourProgramado[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState('');
  const [searchResults, setSearchResults] = useState<TourProgramado[]>([]);

  useEffect(() => {
    fetchTours();
    fetchToursDisponibles();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await api.get('/tours');
      setTours(response.data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };

  const fetchToursDisponibles = async () => {
    try {
      const response = await api.get('/tours-programados/disponibles');
      setToursDisponibles(response.data);
    } catch (error) {
      console.error('Error fetching tours disponibles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (date: string, passengers: number) => {
    try {
      setLoading(true);
      const response = await api.get(`/tours-programados/buscar?fecha=${date}&pasajeros=${passengers}`);
      setSearchResults(response.data);
      setSearchDate(date);
    } catch (error) {
      console.error('Error searching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.homePage}>
      <Header />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <div className="container">
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                Descubre las Maravillosas
                <span className={styles.highlight}> Islas Ballestas</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Vive una experiencia única observando lobos marinos, pingüinos de Humboldt, 
                pelícanos y una increíble variedad de aves marinas en su hábitat natural.
              </p>
              <div className={styles.heroStats}>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>10+</span>
                  <span className={styles.statLabel}>Años de Experiencia</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>50k+</span>
                  <span className={styles.statLabel}>Visitantes Satisfechos</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>98%</span>
                  <span className={styles.statLabel}>Recomendaciones</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className={styles.searchSection}>
        <div className="container">
          <div className={styles.searchCard}>
            <h2 className={styles.searchTitle}>Encuentra tu Tour Perfecto</h2>
            <SearchForm onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Tours Section */}
      <section className={styles.toursSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {searchResults.length > 0 ? 'Resultados de Búsqueda' : 'Tours Disponibles'}
            </h2>
            <p className={styles.sectionSubtitle}>
              Elige entre nuestros tours especialmente diseñados para ofrecerte la mejor experiencia
            </p>
          </div>

          {loading ? (
            <div className={styles.loading}>
              <div className="spinner"></div>
              <p>Cargando tours disponibles...</p>
            </div>
          ) : (
            <div className={styles.toursGrid}>
              {searchResults.length > 0 ? (
                searchResults.map((tourProgramado) => (
                  <TourCard
                    key={`${tourProgramado.id_tour_programado}-${tourProgramado.fecha}`}
                    tour={tourProgramado.tipo_tour}
                    tourProgramado={tourProgramado}
                  />
                ))
              ) : toursDisponibles.length > 0 ? (
                toursDisponibles.slice(0, 6).map((tourProgramado) => (
                  <TourCard
                    key={`${tourProgramado.id_tour_programado}-${tourProgramado.fecha}`}
                    tour={tourProgramado.tipo_tour}
                    tourProgramado={tourProgramado}
                  />
                ))
              ) : (
                <div className={styles.noResults}>
                  <h3>No hay tours disponibles</h3>
                  <p>Lo sentimos, no encontramos tours para la fecha seleccionada.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>¿Por qué elegir Paracas Explorer?</h2>
            <p className={styles.sectionSubtitle}>
              Somos la empresa líder en tours a las Islas Ballestas con más de 10 años de experiencia
            </p>
          </div>
          
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Users className={styles.icon} />
              </div>
              <h3>Guías Expertos</h3>
              <p>Nuestros guías certificados conocen cada rincón de las islas y te brindarán información fascinante sobre la fauna marina.</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Star className={styles.icon} />
              </div>
              <h3>Embarcaciones Seguras</h3>
              <p>Contamos con lanchas modernas equipadas con chalecos salvavidas, techo retráctil y asientos cómodos para tu seguridad.</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Clock className={styles.icon} />
              </div>
              <h3>Horarios Flexibles</h3>
              <p>Múltiples horarios durante el día para que puedas elegir el que mejor se adapte a tus planes de viaje.</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <MapPin className={styles.icon} />
              </div>
              <h3>Ubicación Privilegiada</h3>
              <p>Partimos desde el muelle de Paracas con fácil acceso y estacionamiento gratuito para nuestros clientes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className={styles.experienceSection}>
        <div className="container">
          <div className={styles.experienceGrid}>
            <div className={styles.experienceContent}>
              <h2 className={styles.experienceTitle}>Una Experiencia Inolvidable</h2>
              <p className={styles.experienceText}>
                Las Islas Ballestas son conocidas como las "Galápagos peruanas" por su increíble 
                biodiversidad marina. Durante nuestro tour podrás observar:
              </p>
              
              <ul className={styles.experienceList}>
                <li>🦭 Lobos marinos en su hábitat natural</li>
                <li>🐧 Pingüinos de Humboldt</li>
                <li>🦆 Pelícanos y cormoranes</li>
                <li>🐟 Delfines (con suerte)</li>
                <li>🏔️ Formaciones rocosas espectaculares</li>
                <li>📸 Oportunidades únicas para fotografía</li>
              </ul>
              
              <div className={styles.experienceStats}>
                <div className={styles.experienceStat}>
                  <span className={styles.statIcon}>🌊</span>
                  <div>
                    <strong>2 horas</strong>
                    <p>de aventura marina</p>
                  </div>
                </div>
                <div className={styles.experienceStat}>
                  <span className={styles.statIcon}>🦭</span>
                  <div>
                    <strong>10+ especies</strong>
                    <p>de fauna marina</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.experienceImages}>
              <div className={styles.imageGrid}>
                <img 
                  src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&q=80" 
                  alt="Islas Ballestas vista panorámica"
                  className={styles.experienceImage}
                />
                <img 
                  src="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&q=80" 
                  alt="Lobos marinos"
                  className={styles.experienceImage}
                />
                <img 
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&q=80" 
                  alt="Pingüinos de Humboldt"
                  className={styles.experienceImage}
                />
                <img 
                  src="https://images.unsplash.com/photo-1594736797933-d0800ba0d14d?w=300&q=80" 
                  alt="Tour en lancha"
                  className={styles.experienceImage}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Lo que Dicen Nuestros Visitantes</h2>
          </div>
          
          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonial}>
              <div className={styles.testimonialStars}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={styles.star} fill="currentColor" />
                ))}
              </div>
              <p className={styles.testimonialText}>
                "Una experiencia increíble! Los guías son muy conocedores y las embarcaciones muy seguras. 
                Pudimos ver lobos marinos muy de cerca."
              </p>
              <div className={styles.testimonialAuthor}>
                <strong>María García</strong>
                <span>Lima, Perú</span>
              </div>
            </div>
            
            <div className={styles.testimonial}>
              <div className={styles.testimonialStars}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={styles.star} fill="currentColor" />
                ))}
              </div>
              <p className={styles.testimonialText}>
                "Perfect organization and amazing wildlife! The sea lions and penguins were so close. 
                Highly recommended for families."
              </p>
              <div className={styles.testimonialAuthor}>
                <strong>John Smith</strong>
                <span>New York, USA</span>
              </div>
            </div>
            
            <div className={styles.testimonial}>
              <div className={styles.testimonialStars}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={styles.star} fill="currentColor" />
                ))}
              </div>
              <p className={styles.testimonialText}>
                "El tour familiar fue perfecto para nuestros hijos. Aprendieron mucho sobre la fauna marina 
                y se divirtieron muchísimo."
              </p>
              <div className={styles.testimonialAuthor}>
                <strong>Carlos Mendoza</strong>
                <span>Arequipa, Perú</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contactSection}>
        <div className="container">
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <h2 className={styles.contactTitle}>¿Listo para tu Aventura?</h2>
              <p className={styles.contactText}>
                Contáctanos para reservar tu tour o resolver cualquier duda que tengas.
              </p>
              
              <div className={styles.contactDetails}>
                <div className={styles.contactDetail}>
                  <Phone className={styles.contactIcon} />
                  <div>
                    <strong>Teléfono / WhatsApp</strong>
                    <p>+51 956 847 123</p>
                  </div>
                </div>
                
                <div className={styles.contactDetail}>
                  <Mail className={styles.contactIcon} />
                  <div>
                    <strong>Email</strong>
                    <p>info@paracasexplorer.com</p>
                  </div>
                </div>
                
                <div className={styles.contactDetail}>
                  <MapPin className={styles.contactIcon} />
                  <div>
                    <strong>Ubicación</strong>
                    <p>Av. Paracas 123, El Chaco - Paracas</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.contactCTA}>
              <h3>Reserva Ahora</h3>
              <p>¡No te pierdas esta experiencia única!</p>
              <button 
                className={styles.ctaButton}
                onClick={() => router.push(user ? '/tours' : '/login')}
              >
                {user ? 'Ver Tours Disponibles' : 'Iniciar Sesión para Reservar'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h3>Paracas Explorer</h3>
              <p>Tu mejor opción para explorar las maravillosas Islas Ballestas</p>
              <div className={styles.socialLinks}>
                <a href="#" aria-label="Facebook">📘</a>
                <a href="#" aria-label="Instagram">📷</a>
                <a href="#" aria-label="TripAdvisor">✈️</a>
              </div>
            </div>
            
            <div className={styles.footerSection}>
              <h4>Tours</h4>
              <ul>
                <li><a href="#">Tour Clásico</a></li>
                <li><a href="#">Tour Premium</a></li>
                <li><a href="#">Tour Familiar</a></li>
              </ul>
            </div>
            
            <div className={styles.footerSection}>
              <h4>Información</h4>
              <ul>
                <li><a href="#">Sobre Nosotros</a></li>
                <li><a href="#">Política de Cancelación</a></li>
                <li><a href="#">Términos y Condiciones</a></li>
              </ul>
            </div>
            
            <div className={styles.footerSection}>
              <h4>Contacto</h4>
              <ul>
                <li>+51 956 847 123</li>
                <li>info@paracasexplorer.com</li>
                <li>Paracas, Ica - Perú</li>
              </ul>
            </div>
          </div>
          
          <div className={styles.footerBottom}>
            <p>&copy; 2024 Paracas Explorer. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}