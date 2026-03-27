import { useEffect, useState } from 'react';
import Header from '../Components/Header.jsx';
import Hero from '../Components/Hero.jsx';
import { listarCitasAdmin, eliminarCita, cambiarEstadoCita } from '../lib/api/citas';

export default function AdminCitas() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load() {
    setError('');
    try {
      const data = await listarCitasAdmin();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError('No se pudieron cargar las citas');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(id) {
    if (!window.confirm('¿Estás seguro de eliminar esta cita?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await eliminarCita(Number(id));
      await load();
      setSuccess('Cita eliminada correctamente');
    } catch {
      setError('No se pudo eliminar la cita');
    } finally {
      setLoading(false);
    }
  }

  async function onChangeEstado(id, estado) {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await cambiarEstadoCita(Number(id), estado);
      await load();
      setSuccess('Estado actualizado correctamente');
    } catch {
      setError('No se pudo actualizar el estado');
    } finally {
      setLoading(false);
    }
  }

  // Badge según estado
  const getEstadoBadge = (estado) => {
    const base = 'px-3 py-1 rounded-full text-xs font-semibold';
    const e = (estado || '').toLowerCase();
    if (e === 'confirmada') return `${base} bg-green-100 text-green-800`;
    if (e === 'pendiente') return `${base} bg-yellow-100 text-yellow-800`;
    if (e === 'cancelada' || e === 'rechazada') return `${base} bg-red-100 text-red-800`;
    return `${base} bg-gray-100 text-gray-800`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <Hero
        full
        backgroundImage="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1950&q=80"
      >
        <div className="flex items-center justify-center min-h-[50vh] px-4">
          <div className="bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl max-w-3xl border border-white/30 text-center">
            <span className="inline-block bg-emerald-100 text-emerald-800 px-5 py-2 rounded-full text-sm font-semibold mb-5 shadow-sm">
              📅 Administración
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Citas del sistema
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
              Gestiona todas las citas, cambia su estado o elimínalas.
            </p>
          </div>
        </div>
      </Hero>

      {/* Contenido principal */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Mensajes globales */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl max-w-4xl mx-auto">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl max-w-4xl mx-auto">
              <p className="text-green-600 text-sm text-center">{success}</p>
            </div>
          )}

          {/* Listado de citas */}
          <div className="max-w-4xl mx-auto">
            {items.length === 0 && !loading && (
              <p className="text-center text-gray-600 py-8">No hay citas registradas.</p>
            )}

            <div className="space-y-4">
              {items.map((c, index) => {
                const id = c.id ?? c.id_cita ?? index;
                return (
                  <div
                    key={id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <span className={getEstadoBadge(c.estado)}>
                            {c.estado || 'pendiente'}
                          </span>
                          <span className="text-sm text-gray-500">ID: {id}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {c.motivo || 'Sin motivo especificado'}
                      </h3>

                      <div className="text-sm text-gray-600 space-y-1 mb-4">
                        {c.fecha && (
                          <p>
                            <span className="font-medium">Fecha:</span> {c.fecha}
                          </p>
                        )}
                        {c.hora && (
                          <p>
                            <span className="font-medium">Hora:</span> {c.hora}
                          </p>
                        )}
                        {c.id_cliente && (
                          <p>
                            <span className="font-medium">Cliente ID:</span> {c.id_cliente}
                          </p>
                        )}
                        {c.id_veterinario && (
                          <p>
                            <span className="font-medium">Veterinario ID:</span> {c.id_veterinario}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <select
                          value={c.estado ?? 'pendiente'}
                          onChange={(e) => onChangeEstado(id, e.target.value)}
                          disabled={loading}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmada">Confirmada</option>
                          <option value="cancelada">Cancelada</option>
                        </select>
                        <button
                          onClick={() => onDelete(id)}
                          disabled={loading}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          <span>🗑️</span> Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Spinner de carga */}
            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}