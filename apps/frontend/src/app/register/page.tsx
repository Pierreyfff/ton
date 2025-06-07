'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './register.module.css';

export default function Register() {
  const [formData, setFormData] = useState({
    tipo_documento: 'DNI',
    numero_documento: '',
    nombres: '',
    apellidos: '',
    correo: '',
    contrasena: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(formData);
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.successMessage}>
          <h1>¡Registro Exitoso!</h1>
          <p>Tu cuenta ha sido creada correctamente. Serás redirigido al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.registerForm}>
        <div className={styles.header}>
          <h1>Crear Cuenta</h1>
          <p>Regístrate para hacer tus reservas</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className="grid grid-cols-2">
            <div className="form-group">
              <label htmlFor="tipo_documento" className="form-label">
                Tipo de Documento
              </label>
              <select
                id="tipo_documento"
                name="tipo_documento"
                value={formData.tipo_documento}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="CE">Carné de Extranjería</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="numero_documento" className="form-label">
                Número de Documento
              </label>
              <input
                type="text"
                id="numero_documento"
                name="numero_documento"
                value={formData.numero_documento}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="form-group">
              <label htmlFor="nombres" className="form-label">
                Nombres
              </label>
              <input
                type="text"
                id="nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="apellidos" className="form-label">
                Apellidos
              </label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="correo" className="form-label">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              className="form-input"
              minLength={6}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? <div className="spinner"></div> : 'Crear Cuenta'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            ¿Ya tienes una cuenta?{' '}
            <button 
              onClick={() => router.push('/login')}
              className={styles.link}
            >
              Inicia sesión aquí
            </button>
          </p>
          <button 
            onClick={() => router.push('/')}
            className={styles.link}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}