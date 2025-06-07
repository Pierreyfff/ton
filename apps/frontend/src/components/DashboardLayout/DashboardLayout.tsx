'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/dashboard/reservas', label: 'Reservas', icon: '📋' },
    { path: '/dashboard/tours', label: 'Tours', icon: '🚤' },
    { path: '/dashboard/clientes', label: 'Clientes', icon: '👥' },
  ];

  if (user?.rol === 'ADMIN') {
    menuItems.push(
      { path: '/dashboard/usuarios', label: 'Usuarios', icon: '⚙️' },
      { path: '/dashboard/reportes', label: 'Reportes', icon: '📈' }
    );
  }

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>TON Admin</h2>
          <p>{user?.rol}</p>
        </div>
        
        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className={styles.sidebarFooter}>
          <button onClick={() => router.push('/')} className={styles.navItem}>
            <span className={styles.navIcon}>🏠</span>
            <span>Ir al Sitio</span>
          </button>
          <button onClick={logout} className={styles.navItem}>
            <span className={styles.navIcon}>🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}