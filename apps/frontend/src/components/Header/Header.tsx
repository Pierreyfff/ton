'use client';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Menu, X, User, Calendar, Home, Phone } from 'lucide-react';
import { useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  const handleReservations = () => {
    router.push('/reservas');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.nav}>
          <div className={styles.logo} onClick={() => router.push('/')}>
            <div className={styles.logoIcon}>🌊</div>
            <div className={styles.logoText}>
              <h1>Paracas Explorer</h1>
              <span>Tours Islas Ballestas</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            <div className={styles.navLinks}>
              <a href="#tours" className={styles.navLink}>
                <Calendar className={styles.navIcon} />
                Tours
              </a>
              <a href="#about" className={styles.navLink}>
                <Home className={styles.navIcon} />
                Nosotros
              </a>
              <a href="#contact" className={styles.navLink}>
                <Phone className={styles.navIcon} />
                Contacto
              </a>
            </div>

            {user ? (
              <div className={styles.userMenu}>
                <div className={styles.userInfo}>
                  <User className={styles.userIcon} />
                  <span className={styles.userName}>
                    {user.nombres} {user.apellidos}
                  </span>
                </div>
                
                <div className={styles.userActions}>
                  {user.rol === 'CLIENTE' && (
                    <button onClick={handleReservations} className={styles.navButton}>
                      Mis Reservas
                    </button>
                  )}
                  
                  {(user.rol === 'ADMIN' || user.rol === 'VENDEDOR') && (
                    <button onClick={handleDashboard} className={styles.dashboardButton}>
                      Dashboard
                    </button>
                  )}
                  
                  <button onClick={logout} className={styles.logoutButton}>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.authButtons}>
                <button onClick={handleLogin} className={styles.loginButton}>
                  Iniciar Sesión
                </button>
                <button onClick={handleRegister} className={styles.registerButton}>
                  Reservar Ahora
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className={styles.mobileMenuButton}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className={styles.mobileNav}>
            <div className={styles.mobileNavContent}>
              <div className={styles.mobileNavLinks}>
                <a href="#tours" className={styles.mobileNavLink} onClick={closeMenu}>
                  <Calendar className={styles.navIcon} />
                  Tours Disponibles
                </a>
                <a href="#about" className={styles.mobileNavLink} onClick={closeMenu}>
                  <Home className={styles.navIcon} />
                  Sobre Nosotros
                </a>
                <a href="#contact" className={styles.mobileNavLink} onClick={closeMenu}>
                  <Phone className={styles.navIcon} />
                  Contacto
                </a>
              </div>

              {user ? (
                <div className={styles.mobileUserSection}>
                  <div className={styles.mobileUserInfo}>
                    <User className={styles.userIcon} />
                    <span>{user.nombres} {user.apellidos}</span>
                  </div>
                  
                  <div className={styles.mobileUserActions}>
                    {user.rol === 'CLIENTE' && (
                      <button 
                        onClick={() => { handleReservations(); closeMenu(); }} 
                        className={styles.mobileNavButton}
                      >
                        Mis Reservas
                      </button>
                    )}
                    
                    {(user.rol === 'ADMIN' || user.rol === 'VENDEDOR') && (
                      <button 
                        onClick={() => { handleDashboard(); closeMenu(); }} 
                        className={styles.mobileNavButton}
                      >
                        Dashboard
                      </button>
                    )}
                    
                    <button 
                      onClick={() => { logout(); closeMenu(); }} 
                      className={styles.mobileLogoutButton}
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.mobileAuthSection}>
                  <button 
                    onClick={() => { handleLogin(); closeMenu(); }} 
                    className={styles.mobileLoginButton}
                  >
                    Iniciar Sesión
                  </button>
                  <button 
                    onClick={() => { handleRegister(); closeMenu(); }} 
                    className={styles.mobileRegisterButton}
                  >
                    Reservar Ahora
                  </button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}