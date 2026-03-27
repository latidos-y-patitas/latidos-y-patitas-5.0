import { useEffect, useState } from 'react';
import Header from '../Components/Header.jsx';
import Hero from '../Components/Hero.jsx';
import {
  listarCitasPorVeterinario,
  listarCitasDeCliente,
  confirmarCita,
  cancelarCita,
  eliminarCita,
} from '../lib/api/citas';
import { getUser } from '../lib/api/http';

export default function MisCitas() {
  const [misCitas, setMisCitas] = useState([]);
  const [pendientes, setPendientes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const u = getUser();
  const isVeterinario = u?.role === 'veterinario';
  const uid = isVeterinario
    ? u?.id_veterinario
    : (u?.id ?? u?.id_usuario);

  async function cargarCitas() {
    if (!uid) {
      setError('No se pudo identificar al usuario');
      setInitialLoading(false);
      return;
    }
    try {
      if (isVeterinario) {
        console.log('vet uid:', uid);
        const [confirmadas, pend] = await Promise.all([
          listarCitasPorVeterinario(uid, 'confirmada'),
          listarCitasPorVeterinario(uid, 'pendiente'),
        ]);
        console.log('confirmadas:', confirmadas);
        console.log('pendientes:', pend);
        setMisCitas(Array.isArray(confirmadas) ? confirmadas : []);
        setPendientes(Array.isArray(pend) ? pend : []);
      } else {
        const data = await listarCitasDeCliente(uid);
        setMisCitas(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('error cargarCitas:', e);
      setError('No se pudieron cargar las citas');
    } finally {
      setInitialLoading(false);
    }
  }

  useEffect(() => { cargarCitas(); }, []);

  async function onConfirmar(citaId) {
    setLoading(true);
    setError('');
    try {
      await confirmarCita(uid, citaId);
      await cargarCitas();
    } catch {
      setError('No se pudo confirmar la cita');
    } finally {
      setLoading(false);
    }
  }

  async function onRechazar(citaId) {
    setLoading(true);
    setError('');
    try {
      await cancelarCita(uid, citaId);
      await cargarCitas();
    } catch {
      setError('No se pudo rechazar la cita');
    } finally {
      setLoading(false);
    }
  }

  async function onCancelarCliente(citaId) {
    setLoading(true);
    setError('');
    try {
      await eliminarCita(citaId);
      await cargarCitas();
    } catch {
      setError('No se pudo cancelar la cita');
    } finally {
      setLoading(false);
    }
  }

  const getEstadoBadge = (estado) => {
    const base = 'px-3 py-1 rounded-full text-xs font-semibold';
    const e = (estado || '').toLowerCase();
    if (e === 'confirmada') return `${base} bg-green-100 text-green-800`;
    if (e === 'pendiente')  return `${base} bg-yellow-100 text-yellow-800`;
    if (e === 'cancelada')  return `${base} bg-red-100 text-red-800`;
    return `${base} bg-gray-100 text-gray-800`;
  };

  const getFecha = (c) => c?.disponibilidad?.fecha ?? c?.fecha ?? '—';
  const getHora  = (c) => c?.disponibilidad?.hora_inicio ?? c?.hora ?? '—';
  const getNombreCliente = (c) =>
    c?.cliente?.nombre ?? c?.cliente?.name ?? `Cliente #${c?.id_cliente ?? '?'}`;

  const displayList = activeTab === 'pending' && isVeterinario ? pendientes : misCitas;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

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
              {isVeterinario ? 'Gestión de citas' : 'Mis citas'}
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
              {isVeterinario
                ? 'Administra tus citas confirmadas y solicitudes pendientes.'
                : 'Historial y próximas citas programadas.'}
            </p>
          </div>
        </div>
      </Hero>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">

          {isVeterinario && (
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Mis citas
                  {misCitas.length > 0 && (
                    <span className="ml-2 bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full">
                      {misCitas.length}
                    </span>
                  )}
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
                  {pendientes.length > 0 && (
                    <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                      {pendientes.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {initialLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
            </div>
          ) : displayList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {activeTab === 'pending' && isVeterinario
                  ? 'No hay citas pendientes por revisar.'
                  : 'No tienes citas agendadas.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {displayList.map((c, index) => {
                const id = c?.id_cita ?? c?.id ?? index;
                return (
                  <div
                    key={id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6">
                      {c.estado && (
                        <div className="mb-3">
                          <span className={getEstadoBadge(c.estado)}>{c.estado}</span>
                        </div>
                      )}

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {c.motivo || 'Sin motivo especificado'}
                      </h3>

                      <div className="space-y-1 text-sm text-gray-600 mb-4">
                        <p><span className="font-medium">Fecha:</span> {getFecha(c)}</p>
                        <p><span className="font-medium">Hora:</span> {getHora(c)}</p>
                        {isVeterinario && (
                          <p><span className="font-medium">Cliente:</span> {getNombreCliente(c)}</p>
                        )}
                      </div>

                      {isVeterinario && activeTab === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => onConfirmar(id)}
                            disabled={loading}
                            className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                          >
                            ✓ Aceptar
                          </button>
                          <button
                            onClick={() => onRechazar(id)}
                            disabled={loading}
                            className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                          >
                            ✗ Rechazar
                          </button>
                        </div>
                      ) : !isVeterinario ? (
                        <button
                          onClick={() => onCancelarCliente(id)}
                          disabled={loading}
                          className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          {loading ? 'Cancelando...' : 'Cancelar cita'}
                        </button>
                      ) : null}
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