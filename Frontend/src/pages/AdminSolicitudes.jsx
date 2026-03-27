import { useEffect, useState } from 'react';
import Header from '../Components/Header.jsx';
import Hero from '../Components/Hero.jsx';
import { listarSolicitudesPendientes, cambiarEstadoSolicitud } from '../lib/api/adopcion';
import { request } from '../lib/api/http';

export default function AdminSolicitudes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load() {
    setError('');
    setSuccess('');
    try {
      const data = await listarSolicitudesPendientes();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError('No se pudieron cargar las solicitudes');
    }
  }

  useEffect(() => {
    load();
  }, []);

async function onDecide(id, estado) {
  setLoading(true);
  setError('');
  setSuccess('');
  try {
    // Buscar la solicitud para obtener id_mascota
    const solicitud = items.find(s => (s.id ?? s.id_solicitud) === id);
    
    await cambiarEstadoSolicitud(Number(id), estado);

    // ✅ Si se aprueba, marcar la mascota como adoptada
    if (estado === 'aceptada' && solicitud?.id_mascota) {
      try {
        await request('PUT', `/mascotas/${solicitud.id_mascota}`, 
          { estado: 'adoptada' }, 
          { auth: true }
        );
      } catch {}
    }

    setSuccess(`Solicitud ${estado === 'aceptada' ? 'aceptada' : 'rechazada'} correctamente`);
    await load();
    window.dispatchEvent(new Event('mascotas:updated'));
  } catch {
    setError('No se pudo actualizar el estado');
  } finally {
    setLoading(false);
  }
}

  // Badge para estado (todas están pendientes, pero por si acaso)
  const getEstadoBadge = (estado) => {
    const base = 'px-3 py-1 rounded-full text-xs font-semibold';
    const e = (estado || '').toLowerCase();
    if (e === 'pendiente') return `${base} bg-yellow-100 text-yellow-800`;
    if (e === 'aceptada') return `${base} bg-green-100 text-green-800`;
    if (e === 'rechazada') return `${base} bg-red-100 text-red-800`;
    return `${base} bg-gray-100 text-gray-800`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <Hero
        full
        backgroundImage="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1950&q=80"
      >
        <div className="flex items-center justify-center min-h-[50vh] px-4">
          <div className="bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl max-w-3xl border border-white/30 text-center">
            <span className="inline-block bg-emerald-100 text-emerald-800 px-5 py-2 rounded-full text-sm font-semibold mb-5 shadow-sm">
              📋 Administración
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Solicitudes de adopción
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
              Revisa y gestiona las solicitudes pendientes de adopción.
            </p>
          </div>
        </div>
      </Hero>

      {/* Contenido principal */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Mensajes globales */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-600 text-sm text-center">{success}</p>
              </div>
            )}

            {/* Estado de carga */}
            {loading && items.length === 0 && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            )}

            {/* Sin solicitudes */}
            {!loading && items.length === 0 && !error && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No hay solicitudes pendientes.</p>
              </div>
            )}

            {/* Listado de solicitudes */}
            <div className="space-y-4">
              {items.map((s, index) => {
                const id = s.id_solicitud ?? s.id ?? index;
                const cliente = s.cliente || s.usuario || {};
                const mascota = s.mascota || {};

                return (
                  <div
                    key={id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6">
                      {/* Cabecera con ID y estado */}
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-500">Solicitud #{id}</span>
                          <span className={getEstadoBadge('pendiente')}>Pendiente</span>
                        </div>
                      </div>

                      {/* Información del cliente */}
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-1">Cliente</h3>
                        <p className="text-gray-900">
                          {cliente.nombre ?? cliente.name ?? '---'}
                        </p>
                        {cliente.email && (
                          <a
                            href={`mailto:${cliente.email}`}
                            className="text-emerald-600 hover:text-emerald-700 text-sm"
                          >
                            {cliente.email}
                          </a>
                        )}
                      </div>

                      {/* Información de la mascota */}
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-1">Mascota solicitada</h3>
                        <p className="text-gray-900 font-medium">
                          {mascota.nombre ?? '---'}
                        </p>
                        {mascota.especie && (
                          <p className="text-sm text-gray-600">Especie: {mascota.especie}</p>
                        )}
                      </div>

                      {/* Motivo */}
                      {s.motivo && (
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-gray-700 mb-1">Motivo</h3>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">
                            {s.motivo}
                          </p>
                        </div>
                      )}

                      {/* Botones de acción */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        <button
                          onClick={() => onDecide(id, 'aceptada')}
                          disabled={loading}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          <span>✓</span> Aceptar
                        </button>
                        <button
                          onClick={() => onDecide(id, 'rechazada')}
                          disabled={loading}
                          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          <span>✗</span> Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}