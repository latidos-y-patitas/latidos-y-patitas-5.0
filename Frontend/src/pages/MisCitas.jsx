import { useEffect, useState } from 'react';
import Header from '../Components/Header.jsx';
import Hero from '../Components/Hero.jsx';
import {
  listarCitas,
  listarCitasDeCliente,
  eliminarCita,
  listarCitasPorVeterinario,
  listarDisponibilidad,
} from '../lib/api/citas';
import { getUser } from '../lib/api/http';

export default function MisCitas() {
  const [items, setItems] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'pending'

  useEffect(() => {
    const u = getUser();
    const uid = u?.id ?? u?.id_usuario ?? u?.id_veterinario;
    const fetchPromise =
      u?.role === 'veterinario'
        ? listarCitasPorVeterinario(uid)
        : listarCitasDeCliente(uid);

    fetchPromise
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        let mine;
        if (u?.role === 'veterinario') {
          mine = list.filter((c) => c && Number(c?.id_veterinario) === Number(uid));
        } else {
          mine = list.filter((c) => {
            const cid = c?.id_cliente ?? c?.cliente_id ?? c?.id_usuario ?? c?.user_id;
            return Number(cid) === Number(uid);
          });
        }
        setItems(mine.length > 0 ? mine : list);

        // For veterinarians, also load pending appointments
        if (u?.role === 'veterinario') {
          const pendingPromise = listarCitasPorVeterinario(uid, 'pendiente');
          pendingPromise
            .then((pendingData) => {
              const pendingList = Array.isArray(pendingData) ? pendingData : [];
              const pendingMine = pendingList.filter((c) => c && Number(c?.id_veterinario) === Number(uid));
              setPendingItems(pendingMine.length > 0 ? pendingMine : pendingList);
            })
            .catch(() => {
              // If pending endpoint fails, filter from all
              const pendingFiltered = mine.filter((c) => (c.estado || '').toLowerCase() === 'pendiente');
              setPendingItems(pendingFiltered);
            });
        }
      })
      .catch(() => setError('No se pudieron cargar tus citas'))
      .finally(() => setInitialLoading(false));
  }, []);

  async function onCancel(id) {
    setLoading(true);
    setError('');
    try {
      await eliminarCita(Number(id));
      // refresh list
      const u = getUser();
      const uid = u?.id ?? u?.id_usuario ?? u?.id_veterinario;
      const data = await (u?.role === 'veterinario'
        ? listarCitasPorVeterinario(uid)
        : listarCitasDeCliente(uid));
      const list = Array.isArray(data) ? data : [];
      let mine;
      if (u?.role === 'veterinario') {
        mine = list.filter((c) => c && Number(c?.id_veterinario) === Number(uid));
      } else {
        mine = list.filter((c) => {
          const cid = c?.id_cliente ?? c?.cliente_id ?? c?.id_usuario ?? c?.user_id;
          return Number(cid) === Number(uid);
        });
      }
      setItems(mine.length > 0 ? mine : list);

      // Refresh pending for veterinarians
      if (u?.role === 'veterinario') {
        const pendingPromise = listarCitasPorVeterinario(uid, 'pendiente');
        pendingPromise
          .then((pendingData) => {
            const pendingList = Array.isArray(pendingData) ? pendingData : [];
            const pendingMine = pendingList.filter((c) => c && Number(c?.id_veterinario) === Number(uid));
            setPendingItems(pendingMine.length > 0 ? pendingMine : pendingList);
          })
          .catch(() => {
            const pendingFiltered = mine.filter((c) => (c.estado || '').toLowerCase() === 'pendiente');
            setPendingItems(pendingFiltered);
          });
      }
      // optional refresh availability
      try {
        await listarDisponibilidad();
      } catch {}
    } catch {
      setError('No se pudo cancelar la cita');
    } finally {
      setLoading(false);
    }
  }

  // Badge de estado si está disponible en el objeto
  const getEstadoBadge = (estado) => {
    const base = 'px-3 py-1 rounded-full text-xs font-semibold';
    const e = (estado || '').toLowerCase();
    if (e === 'confirmada' || e === 'aceptada') return `${base} bg-green-100 text-green-800`;
    if (e === 'pendiente') return `${base} bg-yellow-100 text-yellow-800`;
    if (e === 'cancelada' || e === 'rechazada') return `${base} bg-red-100 text-red-800`;
    return `${base} bg-gray-100 text-gray-800`;
  };

  const u = getUser();
  const isVeterinario = u?.role === 'veterinario';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <Hero
        full
        backgroundImage="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1950&q=80"
      >
        <div className="flex items-center justify-center min-h-[50vh] px-4">
          <div className="bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl max-w-3xl border border-white/30 text-center">
            <span className="inline-block bg-emerald-100 text-emerald-800 px-5 py-2 rounded-full text-sm font-semibold mb-5 shadow-sm">
              📅 Tus citas
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Mis citas
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
              Historial y próximas citas programadas.
            </p>
          </div>
        </div>
      </Hero>

      {/* Contenido principal */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {isVeterinario && (
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Mis citas
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'pending'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Pendientes
                </button>
              </div>
            </div>
          )}

          {initialLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : (activeTab === 'pending' && isVeterinario ? pendingItems : items).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {activeTab === 'pending' && isVeterinario
                  ? 'No tienes citas pendientes.'
                  : 'No tienes citas agendadas.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {(activeTab === 'pending' && isVeterinario ? pendingItems : items).map((c, index) => {
                const id = c?.id ?? c?.id_cita ?? index;
                return (
                  <div
                    key={id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6">
                      {/* Estado si está disponible */}
                      {c.estado && (
                        <div className="mb-3">
                          <span className={getEstadoBadge(c.estado)}>{c.estado}</span>
                        </div>
                      )}

                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {c.motivo || 'Sin motivo especificado'}
                      </h3>

                      <div className="space-y-1 text-sm text-gray-600 mb-4">
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
                        {c.id_veterinario && (
                          <p className="text-xs text-gray-500">
                            Veterinario ID: {c.id_veterinario}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => onCancel(id)}
                        disabled={loading}
                        className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                            Cancelando...
                          </>
                        ) : (
                          'Cancelar cita'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {error && (
            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl max-w-2xl mx-auto">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}