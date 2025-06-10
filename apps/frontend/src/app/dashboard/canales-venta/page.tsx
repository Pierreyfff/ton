'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout/DashboardLayout';

interface CanalVenta {
  id_canal: number;
  id_sede: number;
  nombre: string;
  descripcion?: string;
  sede: {
    id_sede: number;
    nombre: string;
  };
  _count: {
    reservas: number;
    pagos: number;
  };
}

export default function CanalesVentaPage() {
  const { user } = useAuth();
  const [canalesVenta, setCanalesVenta] = useState<CanalVenta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCanal, setEditingCanal] = useState<CanalVenta | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });

  useEffect(() => {
    fetchCanalesVenta();
  }, []);

  const fetchCanalesVenta = async () => {
    try {
      setLoading(true);
      const response = await api.get('/canales-venta', {
        params: user?.sede?.id_sede ? { sedeId: user.sede.id_sede } : {},
      });
      setCanalesVenta(response.data);
    } catch (error) {
      console.error('Error fetching canales venta:', error);
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

      if (editingCanal) {
        await api.patch(`/canales-venta/${editingCanal.id_canal}`, dataToSend);
      } else {
        await api.post('/canales-venta', dataToSend);
      }

      await fetchCanalesVenta();
      resetForm();
      setShowModal(false);
    } catch (error: any) {
      console.error('Error saving canal venta:', error);
      alert(error.response?.data?.message || 'Error al guardar el canal de venta');
    }
  };

  const handleEdit = (canal: CanalVenta) => {
    setEditingCanal(canal);
    setFormData({
      nombre: canal.nombre,
      descripcion: canal.descripcion || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este canal de venta?')) {
      try {
        await api.delete(`/canales-venta/${id}`);
        await fetchCanalesVenta();
      } catch (error) {
        console.error('Error deleting canal venta:', error);
        alert('Error al eliminar el canal de venta');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
    });
    setEditingCanal(null);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="spinner"></div>
          <span className="ml-3">Cargando canales de venta...</span>
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
            <h1 className="text-2xl font-bold text-gray-900">Canales de Venta</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestiona los canales por donde se realizan las ventas
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn btn-primary"
          >
            + Nuevo Canal de Venta
          </button>
        </div>

        {/* Lista de Canales de Venta */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Canal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reservas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pagos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {canalesVenta.map((canal) => (
                  <tr key={canal.id_canal}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {canal.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {canal.descripcion || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {canal._count.reservas} reservas
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {canal._count.pagos} pagos
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(canal)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(canal.id_canal)}
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
                  {editingCanal ? 'Editar Canal de Venta' : 'Nuevo Canal de Venta'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Canal
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="form-input"
                      placeholder="Ej: Sitio Web, WhatsApp, Oficina"
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
                      placeholder="Descripción del canal de venta..."
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
                      {editingCanal ? 'Actualizar' : 'Crear'}
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