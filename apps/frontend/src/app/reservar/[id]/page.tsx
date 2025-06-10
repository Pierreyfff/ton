/*'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Corregir ruta de import
import { api } from '@/lib/api';
import { TourProgramado, TipoPasaje } from '@/types';
import styles from './reservar.module.css';
import Header from '@/components/Header/Header';

export default function ReservarPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [tour, setTour] = useState<TourProgramado | null>(null);
  const [loadingTour, setLoadingTour] = useState(true);
  const [pasajes, setPasajes] = useState<{ [key: number]: number }>({});
  const [clienteData, setClienteData] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    tipo_documento: 'DNI',
    numero_documento: ''
  });
  const [notas, setNotas] = useState('');
  const [loading_reserva, setLoadingReserva] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchTour();
    }
  }, [params.id]);

  useEffect(() => {
    if (!loading && user && user.tipo === 'cliente') {
      setClienteData({
        nombres: user.nombres || '',
        apellidos: user.apellidos || '',
        correo: user.correo || '',
        tipo_documento: 'DNI',
        numero_documento: ''
      });
    }
  }, [loading, user]);

  const fetchTour = async () => {
    try {
      const response = await api.get(`/tours/available`);
      const tourEncontrado = response.data.find(
        (t: TourProgramado) => t.id_tour_programado === parseInt(params.id as string)
      );
      setTour(tourEncontrado);
    } catch (error) {
      console.error('Error fetching tour:', error);
      router.push('/');
    } finally {
      setLoadingTour(false);
    }
  };

  const handlePasajeChange = (tipoPasajeId: number, cantidad: number) => {
    setPasajes(prev => ({
      ...prev,
      [tipoPasajeId]: cantidad
    }));
  };

  const calcularTotal = () => {
    if (!tour) return 0;
    return Object.entries(pasajes).reduce((total, [tipoPasajeId, cantidad]) => {
      const tipoPasaje = tour.tipo_tour.tipos_pasaje.find(tp => tp.id_tipo_pasaje === parseInt(tipoPasajeId));
      return total + (tipoPasaje ? tipoPasaje.costo * cantidad : 0);
    }, 0);
  };

  const getTotalPasajeros = () => {
    return Object.values(pasajes).reduce((total, cantidad) => total + cantidad, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/login');
      return;
    }

    if (getTotalPasajeros() === 0) {
      alert('Debes seleccionar al menos un pasaje');
      return;
    }

    if (getTotalPasajeros() > tour!.cupo_disponible) {
      alert('No hay suficientes cupos disponibles');
      return;
    }

    setLoadingReserva(true);

    try {
      let clienteId = user.tipo === 'cliente' ? user.id : null;

      // Si no es cliente registrado, crear cliente temporal
      if (!clienteId) {
        const clienteResponse = await api.post('/clientes', clienteData);
        clienteId = clienteResponse.data.id_cliente;
      }

      const pasajesArray = Object.entries(pasajes)
        .filter(([_, cantidad]) => cantidad > 0)
        .map(([tipoPasajeId, cantidad]) => ({
          id_tipo_pasaje: parseInt(tipoPasajeId),
          cantidad
        }));

      const reservaData = {
        id_cliente: clienteId,
        id_tour_programado: tour!.id_tour_programado,
        id_canal: 1, // Canal web
        id_sede: tour!.id_sede, // Ahora esto debería funcionar
        total_pagar: calcularTotal(),
        notas,
        pasajes: pasajesArray
      };

      const response = await api.post('/reservas', reservaData);
      
      alert('¡Reserva creada exitosamente!');
      router.push(`/reservas/${response.data.id_reserva}`);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al crear la reserva');
    } finally {
      setLoadingReserva(false);
    }
  };

  // Rest of the component remains the same...
  if (loading || loadingTour) {
    return (
      <div>
        <Header />
        <div className={styles.loading}>
          <div className="spinner"></div>
          <p>Cargando información del tour...</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div>
        <Header />
        <div className={styles.error}>
          <h2>Tour no encontrado</h2>
          <button onClick={() => router.push('/')} className="btn btn-primary">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className="container">
          <div className={styles.reservaContainer}>
            {}
            <div className={`card ${styles.tourInfo}`}>
              <div className="card-header">
                <h2>Información del Tour</h2>
              </div>
              <div className="card-body">
                <h3>{tour.tipo_tour.nombre}</h3>
                <p>{tour.tipo_tour.descripcion}</p>
                
                <div className={styles.tourDetails}>
                  <div className={styles.detail}>
                    <strong>Fecha:</strong> 
                    {new Date(tour.fecha).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className={styles.detail}>
                    <strong>Horario:</strong> 
                    {tour.horario.hora_inicio.slice(0, 5)} - {tour.horario.hora_fin.slice(0, 5)}
                  </div>
                  <div className={styles.detail}>
                    <strong>Duración:</strong> 
                    {tour.tipo_tour.duracion_minutos} minutos
                  </div>
                  <div className={styles.detail}>
                    <strong>Embarcación:</strong> 
                    {tour.embarcacion.nombre}
                  </div>
                  <div className={styles.detail}>
                    <strong>Cupos disponibles:</strong> 
                    {tour.cupo_disponible}
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className={`card ${styles.reservaForm}`}>
              <div className="card-header">
                <h2>Realizar Reserva</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {}
                  <div className={styles.section}>
                    <h3>Selecciona tus pasajes</h3>
                    <div className={styles.pasajesList}>
                      {tour.tipo_tour.tipos_pasaje.map((tipoPasaje) => (
                        <div key={tipoPasaje.id_tipo_pasaje} className={styles.pasajeItem}>
                          <div className={styles.pasajeInfo}>
                            <h4>{tipoPasaje.nombre}</h4>
                            {tipoPasaje.edad && (
                              <p className={styles.pasajeEdad}>({tipoPasaje.edad})</p>
                            )}
                            <p className={styles.pasajePrecio}>
                              S/ {tipoPasaje.costo.toFixed(2)}
                            </p>
                          </div>
                          <div className={styles.pasajeSelector}>
                            <label htmlFor={`pasaje-${tipoPasaje.id_tipo_pasaje}`}>
                              Cantidad:
                            </label>
                            <select
                              id={`pasaje-${tipoPasaje.id_tipo_pasaje}`}
                              value={pasajes[tipoPasaje.id_tipo_pasaje] || 0}
                              onChange={(e) => handlePasajeChange(tipoPasaje.id_tipo_pasaje, parseInt(e.target.value))}
                              className="form-input"
                            >
                              {Array.from({ length: Math.min(tour.cupo_disponible + 1, 11) }, (_, i) => (
                                <option key={i} value={i}>{i}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {}
                  {!user && (
                    <div className={styles.section}>
                      <h3>Datos del Cliente</h3>
                      <div className="grid grid-cols-2">
                        <div className="form-group">
                          <label className="form-label">Tipo de Documento</label>
                          <select
                            value={clienteData.tipo_documento}
                            onChange={(e) => setClienteData(prev => ({ ...prev, tipo_documento: e.target.value }))}
                            className="form-input"
                            required
                          >
                            <option value="DNI">DNI</option>
                            <option value="Pasaporte">Pasaporte</option>
                            <option value="CE">Carné de Extranjería</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Número de Documento</label>
                          <input
                            type="text"
                            value={clienteData.numero_documento}
                            onChange={(e) => setClienteData(prev => ({ ...prev, numero_documento: e.target.value }))}
                            className="form-input"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className="form-group">
                          <label className="form-label">Nombres</label>
                          <input
                            type="text"
                            value={clienteData.nombres}
                            onChange={(e) => setClienteData(prev => ({ ...prev, nombres: e.target.value }))}
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Apellidos</label>
                          <input
                            type="text"
                            value={clienteData.apellidos}
                            onChange={(e) => setClienteData(prev => ({ ...prev, apellidos: e.target.value }))}
                            className="form-input"
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Correo Electrónico</label>
                        <input
                          type="email"
                          value={clienteData.correo}
                          onChange={(e) => setClienteData(prev => ({ ...prev, correo: e.target.value }))}
                          className="form-input"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {}
                  <div className={styles.section}>
                    <h3>Notas adicionales (opcional)</h3>
                    <textarea
                      value={notas}
                      onChange={(e) => setNotas(e.target.value)}
                      className="form-input"
                      rows={3}
                      placeholder="Información adicional sobre tu reserva..."
                    />
                  </div>

                  {}
                  <div className={styles.resumen}>
                    <h3>Resumen de la Reserva</h3>
                    <div className={styles.resumenDetails}>
                      <div className={styles.resumenItem}>
                        <span>Total de pasajeros:</span>
                        <span>{getTotalPasajeros()}</span>
                      </div>
                      <div className={styles.resumenItem}>
                        <span>Total a pagar:</span>
                        <span className={styles.total}>S/ {calcularTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <button 
                      type="button"
                      onClick={() => router.back()}
                      className="btn btn-secondary"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading_reserva || getTotalPasajeros() === 0}
                    >
                      {loading_reserva ? <div className="spinner"></div> : 'Confirmar Reserva'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}*/

'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { TourProgramado, TipoPasaje } from '@/types';
import styles from './reservar.module.css';
import Header from '@/components/Header/Header';

export default function ReservarPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [tour, setTour] = useState<TourProgramado | null>(null);
  const [loadingTour, setLoadingTour] = useState(true);
  const [pasajes, setPasajes] = useState<{ [key: number]: number }>({});
  const [clienteData, setClienteData] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    tipo_documento: 'DNI',
    numero_documento: ''
  });
  const [notas, setNotas] = useState('');
  const [loading_reserva, setLoadingReserva] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchTour();
    }
  }, [params.id]);

  useEffect(() => {
    if (!loading && user && user.tipo === 'cliente') {
      setClienteData({
        nombres: user.nombres || '',
        apellidos: user.apellidos || '',
        correo: user.correo || '',
        tipo_documento: 'DNI',
        numero_documento: ''
      });
    }
  }, [loading, user]);

  const fetchTour = async () => {
    try {
      // ✅ CORRECCIÓN: Usar el endpoint específico para obtener un tour programado
      const response = await api.get(`/tours-programados/${params.id}`);
      setTour(response.data);
    } catch (error) {
      console.error('Error fetching tour:', error);
      router.push('/');
    } finally {
      setLoadingTour(false);
    }
  };

  const handlePasajeChange = (tipoPasajeId: number, cantidad: number) => {
    setPasajes(prev => ({
      ...prev,
      [tipoPasajeId]: cantidad
    }));
  };

  const calcularTotal = () => {
    if (!tour) return 0;
    return Object.entries(pasajes).reduce((total, [tipoPasajeId, cantidad]) => {
      const tipoPasaje = tour.tipo_tour.tipos_pasaje.find(tp => tp.id_tipo_pasaje === parseInt(tipoPasajeId));
      return total + (tipoPasaje ? Number(tipoPasaje.costo) * cantidad : 0);
    }, 0);
  };

  const getTotalPasajeros = () => {
    return Object.values(pasajes).reduce((total, cantidad) => total + cantidad, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/login');
      return;
    }

    if (getTotalPasajeros() === 0) {
      alert('Debes seleccionar al menos un pasaje');
      return;
    }

    if (getTotalPasajeros() > tour!.cupo_disponible) {
      alert('No hay suficientes cupos disponibles');
      return;
    }

    setLoadingReserva(true);

    try {
      let clienteId = user.tipo === 'cliente' ? user.id : null;

      // Si no es cliente registrado, crear cliente temporal
      if (!clienteId) {
        const clienteResponse = await api.post('/clientes', clienteData);
        clienteId = clienteResponse.data.id_cliente;
      }

      const pasajesArray = Object.entries(pasajes)
        .filter(([_, cantidad]) => cantidad > 0)
        .map(([tipoPasajeId, cantidad]) => ({
          id_tipo_pasaje: parseInt(tipoPasajeId),
          cantidad
        }));

      const reservaData = {
        id_cliente: clienteId,
        id_tour_programado: tour!.id_tour_programado,
        id_canal: 1, // Canal web por defecto
        id_sede: tour!.id_sede,
        total_pagar: calcularTotal(),
        notas,
        pasajes: pasajesArray
      };

      const response = await api.post('/reservas', reservaData);
      
      alert('¡Reserva creada exitosamente!');
      router.push(`/reservas/${response.data.id_reserva}`);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al crear la reserva');
    } finally {
      setLoadingReserva(false);
    }
  };

  if (loading || loadingTour) {
    return (
      <div>
        <Header />
        <div className={styles.loading}>
          <div className="spinner"></div>
          <p>Cargando información del tour...</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div>
        <Header />
        <div className={styles.error}>
          <h2>Tour no encontrado</h2>
          <button onClick={() => router.push('/')} className="btn btn-primary">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className="container">
          <div className={styles.reservaContainer}>
            {/* Información del Tour */}
            <div className={`card ${styles.tourInfo}`}>
              <div className="card-header">
                <h2>Información del Tour</h2>
              </div>
              <div className="card-body">
                <h3>{tour.tipo_tour.nombre}</h3>
                <p>{tour.tipo_tour.descripcion}</p>
                
                <div className={styles.tourDetails}>
                  <div className={styles.detail}>
                    <strong>Fecha:</strong> 
                    {new Date(tour.fecha).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className={styles.detail}>
                    <strong>Horario:</strong> 
                    {new Date(tour.horario.hora_inicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - 
                    {new Date(tour.horario.hora_fin).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className={styles.detail}>
                    <strong>Duración:</strong> 
                    {tour.tipo_tour.duracion_minutos} minutos
                  </div>
                  <div className={styles.detail}>
                    <strong>Embarcación:</strong> 
                    {tour.embarcacion.nombre}
                  </div>
                  <div className={styles.detail}>
                    <strong>Cupos disponibles:</strong> 
                    {tour.cupo_disponible}
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario de Reserva */}
            <div className={`card ${styles.reservaForm}`}>
              <div className="card-header">
                <h2>Realizar Reserva</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Selección de Pasajes */}
                  <div className={styles.section}>
                    <h3>Selecciona tus pasajes</h3>
                    <div className={styles.pasajesList}>
                      {tour.tipo_tour.tipos_pasaje.map((tipoPasaje) => (
                        <div key={tipoPasaje.id_tipo_pasaje} className={styles.pasajeItem}>
                          <div className={styles.pasajeInfo}>
                            <h4>{tipoPasaje.nombre}</h4>
                            {tipoPasaje.edad && (
                              <p className={styles.pasajeEdad}>({tipoPasaje.edad})</p>
                            )}
                            <p className={styles.pasajePrecio}>
                              S/ {Number(tipoPasaje.costo).toFixed(2)}
                            </p>
                          </div>
                          <div className={styles.pasajeSelector}>
                            <label htmlFor={`pasaje-${tipoPasaje.id_tipo_pasaje}`}>
                              Cantidad:
                            </label>
                            <select
                              id={`pasaje-${tipoPasaje.id_tipo_pasaje}`}
                              value={pasajes[tipoPasaje.id_tipo_pasaje] || 0}
                              onChange={(e) => handlePasajeChange(tipoPasaje.id_tipo_pasaje, parseInt(e.target.value))}
                              className="form-input"
                            >
                              {Array.from({ length: Math.min(tour.cupo_disponible + 1, 11) }, (_, i) => (
                                <option key={i} value={i}>{i}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Datos del Cliente */}
                  {!user && (
                    <div className={styles.section}>
                      <h3>Datos del Cliente</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                          <label className="form-label">Tipo de Documento</label>
                          <select
                            value={clienteData.tipo_documento}
                            onChange={(e) => setClienteData(prev => ({ ...prev, tipo_documento: e.target.value }))}
                            className="form-input"
                            required
                          >
                            <option value="DNI">DNI</option>
                            <option value="Pasaporte">Pasaporte</option>
                            <option value="CE">Carné de Extranjería</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Número de Documento</label>
                          <input
                            type="text"
                            value={clienteData.numero_documento}
                            onChange={(e) => setClienteData(prev => ({ ...prev, numero_documento: e.target.value }))}
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Nombres</label>
                          <input
                            type="text"
                            value={clienteData.nombres}
                            onChange={(e) => setClienteData(prev => ({ ...prev, nombres: e.target.value }))}
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Apellidos</label>
                          <input
                            type="text"
                            value={clienteData.apellidos}
                            onChange={(e) => setClienteData(prev => ({ ...prev, apellidos: e.target.value }))}
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group col-span-2">
                          <label className="form-label">Correo Electrónico</label>
                          <input
                            type="email"
                            value={clienteData.correo}
                            onChange={(e) => setClienteData(prev => ({ ...prev, correo: e.target.value }))}
                            className="form-input"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notas */}
                  <div className={styles.section}>
                    <h3>Notas adicionales (opcional)</h3>
                    <textarea
                      value={notas}
                      onChange={(e) => setNotas(e.target.value)}
                      className="form-input"
                      rows={3}
                      placeholder="Información adicional sobre tu reserva..."
                    />
                  </div>

                  {/* Resumen */}
                  <div className={styles.resumen}>
                    <h3>Resumen de la Reserva</h3>
                    <div className={styles.resumenDetails}>
                      <div className={styles.resumenItem}>
                        <span>Total de pasajeros:</span>
                        <span>{getTotalPasajeros()}</span>
                      </div>
                      <div className={styles.resumenItem}>
                        <span>Total a pagar:</span>
                        <span className={styles.total}>S/ {calcularTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <button 
                      type="button"
                      onClick={() => router.back()}
                      className="btn btn-secondary"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading_reserva || getTotalPasajeros() === 0}
                    >
                      {loading_reserva ? <div className="spinner"></div> : 'Confirmar Reserva'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}