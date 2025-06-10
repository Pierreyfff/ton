'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout/DashboardLayout';
import { Tour } from '@/types';

interface TipoPasaje {
  id_tipo_pasaje: number;
  id_sede: number;
  id_tipo_tour: number;
  nombre: string;
  costo: number;
  edad?: string;
  es_feriado: boolean;
  sede: {
    id_sede: number;
    nombre: string;
  };
  tipo_tour: {
    id_tipo_tour: number;
    nombre: string;
  };
}

export default function TiposPasajePage() {
  const { user } = useAuth();
  const [tiposPasaje, setTiposPasaje] = useState<TipoPasaje[]>([]);
  const [tiposTour, setTiposTour] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTipoPasaje, setEditingTipoPasaje] = useState<TipoPasaje | null>(null);
  const [formData, setFormData] = useState({
    id_tipo_tour: '',
    nombre: '',
    costo: '',
    edad: '',
    es_feriado: false,
  });

  useEffect(() => {
    fetchTiposPasaje();
    fetchTiposTour();
  }, []);

  const fetchTiposPasaje = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tipos-pasaje', {
        params: user?.sede?.id_sede ? { sedeId: user.sede.id_sede } : {},
      });
      setTiposPasaje(response.data);
    } catch (error) {
      console.error('Error fetching tipos pasaje:', error);
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
        costo: parseFloat(formData.costo),
      };

      if (editingTipoPasaje) {
        await api.patch(`/tipos-pasaje/${editingTipoPasaje.id_tipo_pasaje}`, dataToSend);
      } else {
        await api.post('/tipos-pasaje', dataToSend);
      }

      await fetchTiposPasaje();
      resetForm();
      setShowModal(false);
    } catch (error: any) {
      console.error('Error saving tipo pasaje:', error);
      alert(error.response?.data?.message || 'Error al guardar el tipo de pasaje');
    }
  };

  const handleEdit = (tipoPasaje: TipoPasaje) => {
    setEditingTipoPasaje(tipoPasaje);
    setFormData({
      id_tipo_tour: tipoPasaje.id_tipo_tour.toString(),
      nombre: tipoPasaje.nombre,
      costo: tipoPasaje.costo.toString(),
      edad: tipoPasaje.edad || '',
      es_feriado: tipoPasaje.es_feriado,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este tipo de pasaje?')) {
      try {
        await api.delete(`/tipos-pasaje/${id}`);
        await fetchTiposPasaje();
      } catch (error) {
        console.error('Error deleting tipo pasaje:', error);
        alert('Error al eliminar el tipo de pasaje');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id_tipo_tour: '',
      nombre: '',
      costo: '',
      edad: '',
      es_feriado: false,
    });
    setEditingTipoPasaje(null);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="spinner"></div>
          <span className="ml-3">Cargando tipos de pasaje...</span>
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
            <h1 className="text-2xl font-bold text-gray-900">Tipos de Pasaje</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestiona los diferentes tipos y precios de pasajes
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn btn-primary"
          >
            + Nuevo Tipo de Pasaje
          </button>
        </div>

        {/* Lista de Tipos de Pasaje */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo de Pasaje
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Edad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feriado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tiposPasaje.map((tipoPasaje) => (
                  <tr key={tipoPasaje.id_tipo_pasaje}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {tipoPasaje.tipo_tour.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {tipoPasaje.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        S/ {tipoPasaje.costo.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {tipoPasaje.edad || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        tipoPasaje.es_feriado 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {tipoPasaje.es_feriado ? 'Feriado' : 'Normal'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(tipoPasaje)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(tipoPasaje.id_tipo_pasaje)}
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
                  {editingTipoPasaje ? 'Editar Tipo de Pasaje' : 'Nuevo Tipo de Pasaje'}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Tipo de Pasaje
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="form-input"
                      placeholder="Ej: Adulto Nacional, Niño Extranjero"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Costo (S/)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.costo}
                      onChange={(e) => setFormData({ ...formData, costo: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rango de Edad (opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.edad}
                      onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                      className="form-input"
                      placeholder="Ej: 3 a 11 años, 12 años en adelante"
                    />
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.es_feriado}
                        onChange={(e) => setFormData({ ...formData, es_feriado: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm">Es precio para feriados</span>
                    </label>
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
                      {editingTipoPasaje ? 'Actualizar' : 'Crear'}
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