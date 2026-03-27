import { useEffect, useState } from 'react';
import Header from '../Components/Header.jsx';
import Hero from '../Components/Hero.jsx';
import {
  listarCitas,
  listarCitasPorVeterinario,
  cambiarEstadoCita,
  confirmarCita,
  cancelarCita,
} from '../lib/api/citas';
import { getUser } from '../lib/api/http';

export default function VetSolicitudes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setError('');
    try {
      const u = getUser();
      const uid = u?.id ?? u?.id_usuario;
      let list = [];
      if (u?.role === 'veterinario') {
        if (!uid) {
          console.error('vet role but no id present in user object', u);
          const data = await listarCitas();
          list = Array.isArray(data) ? data : [];
        } else {
          list = await listarCitasPorVeterinario(uid, 'pendiente');
        }
      } else {
        const data = await listarCitas();
        list = Array.isArray(data) ? data : [];
      }
      setItems(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('failed to load vet solicitudes', err);
      setError('No se pudieron cargar las solicitudes');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onChangeEstado(id, estado) {
    setLoading(true);
    setError('');
    try {
      const u = getUser();
      const uid = u?.id ?? u?.id_usuario;
      if (u?.role === 'veterinario') {
        if (estado === 'aceptada' || estado === 'confirmada') {
          await confirmarCita(uid, Number(id));
        } else if (estado === 'rechazada' || estado === 'cancelada') {
          await cancelarCita(uid, Number(id));
        } else {
          await cambiarEstadoCita(Number(id), estado);
        }
      } else {
        await cambiarEstadoCita(Number(id), estado);
      }
      await load();
    } catch {
      setError('No se pudo actualizar el estado');
    } finally {
      setLoading(false);
    }
  }

  // Badge de estado
  const getEstadoBadge = (estado) => {
    const base = 'px-3 py-1 rounded-full text-xs font-semibold';
    const e = (estado || '').toLowerCase();
    if (e === 'aceptada' || e === 'confirmada') return `${base} bg-green-100 text-green-800`;
    if (e === 'pendiente') return `${base} bg-yellow-100 text-yellow-800`;
    if (e === 'rechazada' || e === 'cancelada') return `${base} bg-red-100 text-red-800`;
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
              🩺 Solicitudes pendientes
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Citas por revisar
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
              Acepta o rechaza las solicitudes de cita de tus pacientes.
            </p>
          </div>
        </div>
      </Hero>

      {/* Listado de solicitudes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {items.length === 0 && !error && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No hay solicitudes pendientes.</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {items.map((c, index) => {
                const id = c.id ?? c.id_cita ?? index;
                const clienteNombre =
                  c.cliente?.nombre ??
                  c.usuario?.nombre ??
                  c.cliente?.name ??
                  c.usuario?.name ??
                  '';
                const clienteEmail = c.cliente?.email ?? c.usuario?.email ?? '';

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

                      {/* Información del cliente */}
                      {(clienteNombre || clienteEmail) && (
                        <div className="mb-3 text-gray-700">
                          <p className="text-sm">
                            <span className="font-medium">Cliente:</span>{' '}
                            {clienteNombre || '—'}
                            {clienteEmail && ` (${clienteEmail})`}
                          </p>
                        </div>
                      )}

                      {/* Fecha y hora */}
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
                        {c.disponibilidad && (
                          <p className="text-xs text-gray-500">
                            Disponibilidad ID: {c.disponibilidad}
                          </p>
                        )}
                      </div>

                      {/* Botones de acción */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => onChangeEstado(id, 'aceptada')}
                          disabled={loading}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          <span>✓</span> Aceptar
                        </button>
                        <button
                          onClick={() => onChangeEstado(id, 'rechazada')}
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