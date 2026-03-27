import { useEffect, useMemo, useState } from 'react';
import Header from '../Components/Header.jsx';
import Hero from '../Components/Hero.jsx';
import TextInput from '../Components/TextInput.jsx';
import Button from '../Components/Button.jsx';
import {
  crearCita,
  listarCitas,
  listarDisponibilidad,
  eliminarCita,
  cambiarEstadoCita,
  listarCitasAdmin,
  listarCitasActivasAdmin,
  listarEspeciesMascotas,        // ✅ nuevo
  cambiarEstadoDisponibilidad,   // ✅ nuevo
} from '../lib/api/citas';
import { getUser } from '../lib/api/http';

export default function Citas() {
  const [nombre, setNombre] = useState('');
  const [tipoMascota, setTipoMascota] = useState('');
  const [especies, setEspecies] = useState([]);
  const [tipoServicio, setTipoServicio] = useState('Consulta general');
  const [fecha, setFecha] = useState('');
  const [idDisp, setIdDisp] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [citas, setCitas] = useState([]);
  const [allSlots, setAllSlots] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [activosList, setActivosList] = useState([]);

  const u = typeof window !== 'undefined' ? getUser() : null;
  const adminMode = (u?.role ?? '').toLowerCase() === 'admin';

  useEffect(() => {
  listarEspeciesMascotas()
    .then((data) => setEspecies(Array.isArray(data) ? data : []))
    .catch(() => setEspecies(['Perro', 'Gato', 'Otro'])); // fallback
  }, []);

  async function cargarCitas() {
    try {
      const data = await listarCitas();
      setCitas(Array.isArray(data) ? data : []);
    } catch {
      setError('No se pudo cargar citas');
    }
  }

 async function cargarDisponibilidad() {
  try {
    const data = await listarDisponibilidad('disponible'); // ✅ solo disponibles
    setSlots(Array.isArray(data) ? data : []);
  } catch {
    setError('No se pudo cargar disponibilidad');
  }
}

  async function cargarAdminData() {
    setAdminLoading(true);
    try {
      const [c, d] = await Promise.all([
        listarCitasAdmin().catch(() => []),
        listarDisponibilidad().catch(() => []),
      ]);
      setCitas(Array.isArray(c) ? c : []);
      setAllSlots(Array.isArray(d) ? d : []);
      try {
        const a = await listarCitasActivasAdmin();
        setActivosList(Array.isArray(a) ? a : []);
      } catch {
        setActivosList([]);
      }
    } catch {
      setError('No se pudieron cargar datos de citas');
    } finally {
      setAdminLoading(false);
    }
  }

  useEffect(() => {
    if (adminMode) {
      cargarAdminData();
    }
  }, [adminMode]);

  const activos = useMemo(() => {
    if (Array.isArray(activosList) && activosList.length > 0) {
      return activosList;
    }
    if (!Array.isArray(citas) || citas.length === 0) return [];
    const now = new Date();
    function parseSlot(c) {
      if (c?.fecha && c?.hora) {
        return { fecha: c.fecha, inicio: c.hora, fin: c.hora };
      }
      const idd = c?.id_disponibilidad;
      const s = Array.isArray(allSlots) ? allSlots.find((x) => x.id_disponibilidad === idd) : null;
      if (!s) return null;
      return { fecha: s.fecha, inicio: s.hora_inicio, fin: s.hora_fin };
    }
    function isNow(fecha, hIni, hFin) {
      if (!fecha || !hIni) return false;
      const [Y, M, D] = fecha.split('-').map(Number);
      const [h1, m1] = String(hIni).split(':').map(Number);
      const [h2, m2] = String(hFin || hIni).split(':').map(Number);
      const start = new Date(Y, M - 1, D, h1, m1, 0);
      const end = new Date(Y, M - 1, D, h2, m2, 0);
      return now >= start && now <= end;
    }
    return citas.filter((c) => {
      const estado = (c?.estado ?? '').toLowerCase();
      if (estado === 'rechazada') return false;
      const slot = parseSlot(c);
      if (!slot) return estado === 'aceptada';
      return isNow(slot.fecha, slot.inicio, slot.fin) || estado === 'aceptada';
    });
  }, [citas, allSlots]);

  async function adminEliminar(id) {
    setAdminLoading(true);
    setError('');
    try {
      await eliminarCita(Number(id));
      await cargarAdminData();
    } catch {
      setError('No se pudo eliminar la cita');
    } finally {
      setAdminLoading(false);
    }
  }

  async function adminEstado(id, estado) {
    setAdminLoading(true);
    setError('');
    try {
      await cambiarEstadoCita(Number(id), estado);
      await cargarAdminData();
    } catch {
      setError('No se pudo actualizar el estado');
    } finally {
      setAdminLoading(false);
    }
  }

  async function onSubmit(e) {
  e.preventDefault();
  setError('');
  setSuccess('');
  setLoading(true);
  try {
    const motivo = `Nombre: ${nombre}; Mascota: ${tipoMascota}; Servicio: ${tipoServicio}; Fecha: ${fecha}`;
    await crearCita({ motivo, id_disponibilidad: idDisp ? Number(idDisp) : undefined });
    // ✅ Marcar disponibilidad como ocupada
    if (idDisp) {
      await cambiarEstadoDisponibilidad(Number(idDisp), 'reservada');
    }
    setSuccess('Cita creada correctamente');
    setNombre('');
    setTipoMascota('');
    setTipoServicio('Consulta general');
    setFecha('');
    setIdDisp('');
    await cargarDisponibilidad(); // recarga solo las disponibles
  } catch (err) {
    setError(typeof err?.message === 'string' ? err.message : 'Error al crear la cita');
  } finally {
    setLoading(false);
  }
}

  // Función para obtener clases de estado
  const getEstadoBadge = (estado) => {
    const e = (estado || '').toLowerCase();
    const base = 'px-3 py-1 rounded-full text-xs font-semibold';
    if (e === 'confirmada' || e === 'aceptada') return `${base} bg-green-100 text-green-800`;
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
              🩺 Cuidado veterinario
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Agenda la cita de tu <span className="text-emerald-600">mascota</span>
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
              Ofrecemos atención profesional y personalizada para el bienestar de tu compañero fiel.
            </p>
          </div>
        </div>
      </Hero>

      {/* Admin Section: Citas activas ahora */}
      {adminMode && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <span className="text-emerald-700 font-semibold text-sm uppercase tracking-wider bg-emerald-100 px-5 py-2 rounded-full">
                ADMINISTRADOR
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
                Citas activas ahora
              </h2>
            </div>

            {adminLoading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            )}

            {!adminLoading && activos.length === 0 && (
              <p className="text-center text-gray-600 py-8">No hay citas activas en este momento.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activos.map((c, i) => {
                const id = c.id ?? c.id_cita ?? i;
                return (
                  <div
                    key={id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <span className={getEstadoBadge(c.estado)}>{c.estado || 'Pendiente'}</span>
                      </div>
                      <p className="text-gray-800 font-medium mb-2 line-clamp-2">{c.motivo || 'Sin motivo'}</p>
                      {c.fecha && (
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Fecha:</span> {c.fecha}
                        </p>
                      )}
                      {c.hora && (
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Hora:</span> {c.hora}
                        </p>
                      )}
                      {c.id_cliente && (
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Cliente ID:</span> {c.id_cliente}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-5">
                        <select
                          defaultValue={c.estado ?? 'pendiente'}
                          onChange={(e) => adminEstado(id, e.target.value)}
                          disabled={adminLoading}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmada">Confirmada</option>
                          <option value="cancelada">Cancelada</option>
                        </select>
                        <button
                          onClick={() => adminEliminar(id)}
                          disabled={adminLoading}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Sección principal: información + formulario */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Información de servicios */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Información de Citas</h3>
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Servicios disponibles</h4>
                <ul className="space-y-2">
                  {['Consulta general', 'Vacunación', 'Desparasitación', 'Peluquería', 'Urgencias'].map(
                    (servicio) => (
                      <li key={servicio} className="flex items-center gap-2 text-gray-700">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        {servicio}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Horario de Atención</h4>
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-medium">Lunes a Viernes:</span> 8:00 AM - 7:00 PM</p>
                  <p><span className="font-medium">Sábados:</span> 9:00 AM - 5:00 PM</p>
                  <p><span className="font-medium">Domingos:</span> 10:00 AM - 2:00 PM (Solo emergencias)</p>
                </div>
              </div>
            </div>

            {/* Formulario de cita */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Agenda tu cita</h3>
              <form onSubmit={onSubmit} className="space-y-4">
                <TextInput
                  label="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  name="nombre"
                  required
                />

                {/* Tipo de mascota — dinámico */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de mascota
                  </label>
                  <select
                    value={tipoMascota}
                    onChange={(e) => setTipoMascota(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="">Selecciona una especie</option>
                    {especies.map((esp) => (
                      <option key={esp} value={esp}>{esp}</option>
                    ))}
                  </select>
                </div>

                {/* ❌ Elimina completamente el TextInput de Hora */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de servicio
                  </label>
                  <select
                    value={tipoServicio}
                    onChange={(e) => setTipoServicio(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option>Consulta general</option>
                    <option>Vacunación</option>
                    <option>Desparasitación</option>
                    <option>Peluquería</option>
                    <option>Urgencias</option>
                  </select>
                </div>

                <TextInput
                  label="Fecha de la cita"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  name="fecha"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disponibilidad
                  </label>
                  <select
                    value={idDisp}
                    onChange={(e) => setIdDisp(e.target.value)}
                    onFocus={() => slots.length === 0 && cargarDisponibilidad()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="">Selecciona un horario disponible</option>
                    {slots.map((d) => (
                      <option key={d.id_disponibilidad} value={d.id_disponibilidad}>
                        {d.fecha} • {d.hora_inicio} – {d.hora_fin}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={loading} size="large" className="w-full">
                    {loading ? 'Guardando...' : 'Agendar Cita'}
                  </Button>
                </div>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
              )}
              {success && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-green-600 text-sm text-center">{success}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Historial de citas del usuario */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-emerald-700 font-semibold text-sm uppercase tracking-wider bg-emerald-100 px-5 py-2 rounded-full">
              TUS CITAS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">Historial de citas</h2>
          </div>

          {citas.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No tienes citas agendadas.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {citas.map((c, i) => (
                <div
                  key={c?.id ?? i}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className={getEstadoBadge(c.estado)}>{c.estado || 'Pendiente'}</span>
                    </div>
                    <p className="text-gray-800 font-medium mb-2 line-clamp-2">{c.motivo || 'Sin motivo'}</p>
                    {c.fecha && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Fecha:</span> {c.fecha}
                      </p>
                    )}
                    {c.hora && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Hora:</span> {c.hora}
                      </p>
                    )}
                    {c.id_cliente && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Cliente ID:</span> {c.id_cliente}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}