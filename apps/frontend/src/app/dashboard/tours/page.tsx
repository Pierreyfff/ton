'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout/DashboardLayout';
import { Tour } from '@/types';

export default function ToursPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tours', {
        params: user?.sede?.id_sede ? { sedeId: user.sede.id_sede } : {},
      });
      setTours(response.data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este tour?')) {
      try {
        await api.delete(`/tours/${id}`);
        await fetchTours();
      } catch (error) {
        console.error('Error deleting tour:', error);
        alert('Error al eliminar el tour');
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="spinner"></div>
          <span className="ml-3">Cargando tours...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Tours</h1>
            <p className="mt-1 text-sm text-gray-500">
              Administra los tipos de tours disponibles
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/tours/nuevo')}
            className="btn btn-primary"
          >
            + Nuevo Tour
          </button>
        </div>

        {/* Lista de Tours */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <div key={tour.id_tipo_tour} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {tour.url_imagen && (
                <img
                  src={tour.url_imagen}
                  alt={tour.nombre}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tour.nombre}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {tour.descripcion}
                </p>
                
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex justify-between">
                    <span>Duración:</span>
                    <span>{tour.duracion_minutos} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacidad:</span>
                    <span>{tour.cantidad_pasajeros} pasajeros</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sede:</span>
                    <span>{tour.sede.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tipos de Pasaje:</span>
                    <span>{tour.tipos_pasaje.length} tipos</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/dashboard/tours/${tour.id_tipo_tour}`)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm"
                    >
                      Ver Detalles
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/tours/${tour.id_tipo_tour}/editar`)}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      Editar
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(tour.id_tipo_tour)}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tours.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏖️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay tours registrados
            </h3>
            <p className="text-gray-500 mb-4">
              Comienza creando tu primer tipo de tour
            </p>
            <button
              onClick={() => router.push('/dashboard/tours/nuevo')}
              className="btn btn-primary"
            >
              Crear Primer Tour
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}