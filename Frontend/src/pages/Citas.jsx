import { useEffect, useMemo, useState } from 'react';
import Header from '../Components/Header.jsx';
import Hero from '../Components/Hero.jsx';
import TextInput from '../Components/TextInput.jsx';
import Button from '../Components/Button.jsx';
import { crearCita, listarCitas, listarDisponibilidad, eliminarCita, cambiarEstadoCita, listarCitasAdmin, listarCitasActivasAdmin } from '../lib/api/citas';
import { getUser } from '../lib/api/http';
import '../styles/citas.css'; 

export default function Citas() {
  const [nombre, setNombre] = useState('');
  const [tipoMascota, setTipoMascota] = useState('Perro');
  const [tipoServicio, setTipoServicio] = useState('Consulta general');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
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
      const data = await listarDisponibilidad('disponible');
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
      const [Y, M, D] = fecha.split('-').map((n) => Number(n));
      const [h1, m1] = String(hIni).split(':').map((n) => Number(n));
      const [h2, m2] = String(hFin || hIni).split(':').map((n) => Number(n));
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
      const motivo = `Nombre: ${nombre}; Mascota: ${tipoMascota}; Servicio: ${tipoServicio}; Fecha: ${fecha}; Hora: ${hora}`;
      await crearCita({ motivo, id_disponibilidad: idDisp ? Number(idDisp) : undefined });
      setSuccess('Cita creada correctamente');
      setNombre('');
      setTipoMascota('Perro');
      setTipoServicio('Consulta general');
      setFecha('');
      setHora('');
      setIdDisp('');
      await cargarCitas();
    } catch (err) {
      setError(typeof err?.message === 'string' ? err.message : 'Error al crear la cita');
    } finally {
      setLoading(false);
    }
  }

  // Función para obtener clase de estado
  const getEstadoClass = (estado) => {
    const e = (estado || '').toLowerCase();
    if (e === 'confirmada' || e === 'aceptada') return 'badge badge-success';
    if (e === 'pendiente') return 'badge badge-warning';
    if (e === 'cancelada' || e === 'rechazada') return 'badge badge-danger';
    return 'badge badge-secondary';
  };

  return (
    <div className="citas-page">
      <Header />

      <Hero full>
        <div className="hero-contenido">
          <div className="hero-card">
            <span className="hero-badge">🩺 Cuidado veterinario</span>
            <h1 className="hero-titulo">
              Agenda la cita de tu <span>mascota</span>
            </h1>
            <p className="hero-descripcion">
              Ofrecemos atención profesional y personalizada para el bienestar de tu compañero fiel.
            </p>
          </div>
        </div>
      </Hero>

      {adminMode && (
        <section className="admin-section">
          <div className="container">
            <div className="seccion-header">
              <span className="seccion-badge">ADMINISTRADOR</span>
              <h2>Citas activas ahora</h2>
            </div>

            {adminLoading && <div className="loading-spinner">Cargando...</div>}

            {activos.length === 0 && !adminLoading && (
              <p className="no-data">No hay citas activas en este momento.</p>
            )}

            <div className="citas-grid">
              {activos.map((c, i) => {
                const id = c.id ?? c.id_cita ?? i;
                return (
                  <div key={id} className="cita-card admin-card" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="cita-header">
                      <span className={getEstadoClass(c.estado)}>{c.estado || 'Pendiente'}</span>
                    </div>
                    <div className="cita-body">
                      <p className="cita-motivo">{c.motivo || 'Sin motivo'}</p>
                      {c.fecha && <p className="cita-fecha"><strong>Fecha:</strong> {c.fecha}</p>}
                      {c.hora && <p className="cita-hora"><strong>Hora:</strong> {c.hora}</p>}
                      {c.id_cliente && <p className="cita-cliente"><strong>Cliente ID:</strong> {c.id_cliente}</p>}
                    </div>
                    <div className="cita-acciones">
                      <select
                        defaultValue={c.estado ?? 'pendiente'}
                        onChange={(e) => adminEstado(id, e.target.value)}
                        className="input-field select-small"
                        disabled={adminLoading}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmada">Confirmada</option>
                        <option value="cancelada">Cancelada</option>
                      </select>
                      <Button
                        onClick={() => adminEliminar(id)}
                        disabled={adminLoading}
                        variant="danger"
                        size="small"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {error && <p className="auth-feedback error">{error}</p>}
          </div>
        </section>
      )}

      <section className="cita-principal-section">
        <div className="container grid-2">
          <div className="info-card">
            <h3>Información de Citas</h3>
            <ul className="servicios-lista">
              <li>Consulta general</li>
              <li>Vacunación</li>
              <li>Desparasitación</li>
              <li>Peluquería</li>
              <li>Urgencias</li>
            </ul>
            <h4>Horario de Atención</h4>
            <div className="horario">
              <p><strong>Lunes a Viernes:</strong> 8:00 AM - 7:00 PM</p>
              <p><strong>Sábados:</strong> 9:00 AM - 5:00 PM</p>
              <p><strong>Domingos:</strong> 10:00 AM - 2:00 PM (Solo emergencias)</p>
            </div>
          </div>

          <div className="form-card">
            <h3>Agenda tu cita</h3>
            <form onSubmit={onSubmit}>
              <TextInput
                label="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                name="nombre"
                required
              />

              <div className="input-group">
                <label className="input-label">Tipo de mascota</label>
                <select
                  value={tipoMascota}
                  onChange={(e) => setTipoMascota(e.target.value)}
                  className="input-field"
                  required
                >
                  <option>Perro</option>
                  <option>Gato</option>
                  <option>Otro</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Tipo de servicio</label>
                <select
                  value={tipoServicio}
                  onChange={(e) => setTipoServicio(e.target.value)}
                  className="input-field"
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

              <TextInput
                label="Hora de la cita"
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                name="hora"
                required
              />

              <div className="input-group">
                <label className="input-label">Disponibilidad</label>
                <select
                  value={idDisp}
                  onChange={(e) => setIdDisp(e.target.value)}
                  onFocus={() => slots.length === 0 && cargarDisponibilidad()}
                  className="input-field"
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

              <div className="form-actions">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Guardando...' : 'Agendar Cita'}
                </Button>
              </div>
            </form>

            {error && <p className="auth-feedback error">{error}</p>}
            {success && <p className="auth-feedback success">{success}</p>}
          </div>
        </div>
      </section>

      <section className="mis-citas-section">
        <div className="container">
          <div className="seccion-header">
            <span className="seccion-badge">TUS CITAS</span>
            <h2>Historial de citas</h2>
          </div>

          {citas.length === 0 ? (
            <p className="no-data">No tienes citas agendadas.</p>
          ) : (
            <div className="citas-grid">
              {citas.map((c, i) => (
                <div key={c?.id ?? i} className="cita-card" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="cita-header">
                    <span className={getEstadoClass(c.estado)}>{c.estado || 'Pendiente'}</span>
                  </div>
                  <div className="cita-body">
                    <p className="cita-motivo">{c.motivo || 'Sin motivo'}</p>
                    {c.fecha && <p className="cita-fecha"><strong>Fecha:</strong> {c.fecha}</p>}
                    {c.hora && <p className="cita-hora"><strong>Hora:</strong> {c.hora}</p>}
                    {c.id_cliente && <p className="cita-cliente"><strong>Cliente ID:</strong> {c.id_cliente}</p>}
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