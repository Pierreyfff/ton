'use client';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

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

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.nav}>
          <div className={styles.logo} onClick={() => router.push('/')}>
            <h1>TON</h1>
            <span>Tours Islas Ballestas</span>
          </div>
          
          <nav className={styles.navigation}>
            {user ? (
              <div className={styles.userMenu}>
                <span className={styles.userName}>
                  {user.nombres} {user.apellidos}
                </span>
                
                {user.rol === 'CLIENTE' && (
                  <button onClick={handleReservations} className="btn btn-secondary">
                    Mis Reservas
                  </button>
                )}
                
                {(user.rol === 'ADMIN' || user.rol === 'VENDEDOR') && (
                  <button onClick={handleDashboard} className="btn btn-secondary">
                    Dashboard
                  </button>
                )}
                
                <button onClick={logout} className="btn btn-primary">
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className={styles.authButtons}>
                <button onClick={handleLogin} className="btn btn-secondary">
                  Iniciar Sesión
                </button>
                <button onClick={handleRegister} className="btn btn-primary">
                  Registrarse
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}