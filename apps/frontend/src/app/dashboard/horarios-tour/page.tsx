'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout/DashboardLayout';
import { Tour } from '@/types';

interface HorarioTour {
  id_horario: number;
  id_tipo_tour: number;
  id_sede: number;
  hora_inicio: string;
  hora_fin: string;
  disponible_lunes: boolean;
  disponible_martes: boolean;
  disponible_miercoles: boolean;
  disponible_jueves: boolean;
  disponible_viernes: boolean;
  disponible_sabado: boolean;
  disponible_domingo: boolean;
  tipo_tour: {
    id_tipo_tour: number;
    nombre: string;
  };
  sede: {
    id_sede: number;
    nombre: string;
  };
}

export default function HorariosTourPage() {
  const { user } = useAuth();
  const [horarios, setHorarios] = useState<HorarioTour[]>([]);
  const [tiposTour, setTiposTour] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHorario, setEditingHorario] = useState<HorarioTour | null>(null);
  const [formData, setFormData] = useState({
    id_tipo_tour: '',
    hora_inicio: '',
    hora_fin: '',
    disponible_lunes: false,
    disponible_martes: false,
    disponible_miercoles: false,
    disponible_jueves: false,
    disponible_viernes: false,
    disponible_sabado: false,
    disponible_domingo: false,
  });

  useEffect(() => {
    fetchHorarios();
    fetchTiposTour();
  }, []);

  const fetchHorarios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/horarios-tour', {
        params: user?.sede?.id_sede ? { sedeId: user.sede.id_sede } : {},
      });
      setHorarios(response.data);
    } catch (error) {
      console.error('Error fetching horarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTiposTour = async () => {
    try {
      const response = await api.get('/tours', {
        params: user?.sede?.id_sede ? { sedeId: user.sede.id_sede } : {},
      });
      setTiposTour(response.data);
    } catch (error) {
      console.error('Error fetching tipos tour:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const dataToSend = {
        ...formData,
        id_tipo_tour: parseInt(formData.id_tipo_tour),
        id_sede: user?.sede?.id_sede || 1,
        hora_inicio: `2025-06-10T${formData.hora_inicio}:00Z`,
        hora_fin: `2025-06-10T${formData.hora_fin}:00Z`,
      };

      if (editingHorario) {
        await api.patch(`/horarios-tour/${editingHorario.id_horario}`, dataToSend);
      } else {
        await api.post('/horarios-tour', dataToSend);
      }

      await fetchHorarios();
      resetForm();
      setShowModal(false);
    } catch (error: any) {
      console.error('Error saving horario:', error);
      alert(error.response?.data?.message || 'Error al guardar el horario');
    }
  };

  const handleEdit = (horario: HorarioTour) => {
    setEditingHorario(horario);
    setFormData({
      id_tipo_tour: horario.id_tipo_tour.toString(),
      hora_inicio: new Date(horario.hora_inicio).toTimeString().slice(0, 5),
      hora_fin: new Date(horario.hora_fin).toTimeString().slice(0, 5),
      disponible_lunes: horario.disponible_lunes,
      disponible_martes: horario.disponible_martes,
      disponible_miercoles: horario.disponible_miercoles,
      disponible_jueves: horario.disponible_jueves,
      disponible_viernes: horario.disponible_viernes,
      disponible_sabado: horario.disponible_sabado,
      disponible_domingo: horario.disponible_domingo,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este horario?')) {
      try {
        await api.delete(`/horarios-tour/${id}`);
        await fetchHorarios();
      } catch (error) {
        console.error('Error deleting horario:', error);
        alert('Error al eliminar el horario');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id_tipo_tour: '',
      hora_inicio: '',
      hora_fin: '',
      disponible_lunes: false,
      disponible_martes: false,
      disponible_miercoles: false,
      disponible_jueves: false,
      disponible_viernes: false,
      disponible_sabado: false,
      disponible_domingo: false,
    });
    setEditingHorario(null);
  };

  const getDiasDisponibles = (horario: HorarioTour) => {
    const dias = [];
    if (horario.disponible_lunes) dias.push('L');
    if (horario.disponible_martes) dias.push('M');
    if (horario.disponible_miercoles) dias.push('Mi');
    if (horario.disponible_jueves) dias.push('J');
    if (horario.disponible_viernes) dias.push('V');
    if (horario.disponible_sabado) dias.push('S');
    if (horario.disponible_domingo) dias.push('D');
    return dias.join(', ');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="spinner"></div>
          <span className="ml-3">Cargando horarios...</span>
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
            <h1 className="text-2xl font-bold text-gray-900">Horarios de Tours</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestiona los horarios disponibles para cada tipo de tour
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn btn-primary"
          >
            + Nuevo Horario
          </button>
        </div>

        {/* Lista de Horarios */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Días Disponibles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {horarios.map((horario) => (
                  <tr key={horario.id_horario}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {horario.tipo_tour.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(horario.hora_inicio).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {new Date(horario.hora_fin).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getDiasDisponibles(horario)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(horario)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(horario.id_horario)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingHorario ? 'Editar Horario' : 'Nuevo Horario'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Tour
                    </label>
                    <select
                      value={formData.id_tipo_tour}
                      onChange={(e) => setFormData({ ...formData, id_tipo_tour: e.target.value })}
                      className="form-input"
                      required
                    >
                      <option value="">Seleccionar tour</option>
                      {tiposTour.map((tour) => (
                        <option key={tour.id_tipo_tour} value={tour.id_tipo_tour}>
                          {tour.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora Inicio
                      </label>
                      <input
                        type="time"
                        value={formData.hora_inicio}
                        onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora Fin
                      </label>
                      <input
                        type="time"
                        value={formData.hora_fin}
                        onChange={(e) => setFormData({ ...formData, hora_fin: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Días Disponibles
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'disponible_lunes', label: 'Lunes' },
                        { key: 'disponible_martes', label: 'Martes' },
                        { key: 'disponible_miercoles', label: 'Miércoles' },
                        { key: 'disponible_jueves', label: 'Jueves' },
                        { key: 'disponible_viernes', label: 'Viernes' },
                        { key: 'disponible_sabado', label: 'Sábado' },
                        { key: 'disponible_domingo', label: 'Domingo' },
                      ].map((dia) => (
                        <label key={dia.key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData[dia.key as keyof typeof formData] as boolean}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              [dia.key]: e.target.checked 
                            })}
                            className="mr-2"
                          />
                          <span className="text-sm">{dia.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="btn btn-secondary"
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingHorario ? 'Actualizar' : 'Crear'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}