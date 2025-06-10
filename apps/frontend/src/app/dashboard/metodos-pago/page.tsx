'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout/DashboardLayout';

interface MetodoPago {
  id_metodo_pago: number;
  id_sede: number;
  nombre: string;
  descripcion?: string;
  sede: {
    id_sede: number;
    nombre: string;
  };
  _count: {
    pagos: number;
  };
}

export default function MetodosPagoPage() {
  const { user } = useAuth();
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMetodo, setEditingMetodo] = useState<MetodoPago | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });

  useEffect(() => {
    fetchMetodosPago();
  }, []);

  const fetchMetodosPago = async () => {
    try {
      setLoading(true);
      const response = await api.get('/metodos-pago', {
        params: user?.sede?.id_sede ? { sedeId: user.sede.id_sede } : {},
      });
      setMetodosPago(response.data);
    } catch (error) {
      console.error('Error fetching metodos pago:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const dataToSend = {
        ...formData,
        id_sede: user?.sede?.id_sede || 1,
      };

      if (editingMetodo) {
        await api.patch(`/metodos-pago/${editingMetodo.id_metodo_pago}`, dataToSend);
      } else {
        await api.post('/metodos-pago', dataToSend);
      }

      await fetchMetodosPago();
      resetForm();
      setShowModal(false);
    } catch (error: any) {
      console.error('Error saving metodo pago:', error);
      alert(error.response?.data?.message || 'Error al guardar el método de pago');
    }
  };

  const handleEdit = (metodo: MetodoPago) => {
    setEditingMetodo(metodo);
    setFormData({
      nombre: metodo.nombre,
      descripcion: metodo.descripcion || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este método de pago?')) {
      try {
        await api.delete(`/metodos-pago/${id}`);
        await fetchMetodosPago();
      } catch (error) {
        console.error('Error deleting metodo pago:', error);
        alert('Error al eliminar el método de pago');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
    });
    setEditingMetodo(null);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="spinner"></div>
          <span className="ml-3">Cargando métodos de pago...</span>
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
            <h1 className="text-2xl font-bold text-gray-900">Métodos de Pago</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestiona los métodos de pago disponibles para las reservas
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn btn-primary"
          >
            + Nuevo Método de Pago
          </button>
        </div>

        {/* Lista de Métodos de Pago */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {metodosPago.map((metodo) => (
                  <tr key={metodo.id_metodo_pago}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {metodo.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {metodo.descripcion || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {metodo._count.pagos} pagos
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(metodo)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(metodo.id_metodo_pago)}
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
                  {editingMetodo ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Método
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="form-input"
                      placeholder="Ej: Efectivo, Tarjeta de Crédito, Yape"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      className="form-input"
                      rows={3}
                      placeholder="Descripción del método de pago..."
                    />
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
                      {editingMetodo ? 'Actualizar' : 'Crear'}
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