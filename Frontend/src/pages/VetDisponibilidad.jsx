import { useEffect, useState } from 'react';
import Header from '../Components/Header.jsx';
import Hero from '../Components/Hero.jsx';
import TextInput from '../Components/TextInput.jsx';
import Button from '../Components/Button.jsx';
import {
  listarDisponibilidad,
  crearDisponibilidad,
  actualizarDisponibilidad,
  eliminarDisponibilidad,
  cambiarEstadoDisponibilidad,
} from '../lib/api/citas';

export default function VetDisponibilidad() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Formulario nuevo
  const [fecha, setFecha] = useState('');
  const [inicio, setInicio] = useState('');
  const [fin, setFin] = useState('');
  const [estado, setEstado] = useState('disponible');

  // Edición
  const [editId, setEditId] = useState(null);
  const [editFecha, setEditFecha] = useState('');
  const [editInicio, setEditInicio] = useState('');
  const [editFin, setEditFin] = useState('');
  const [editEstado, setEditEstado] = useState('disponible');

  async function load() {
    setError('');
    try {
      const data = await listarDisponibilidad();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError('No se pudo cargar la disponibilidad');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await crearDisponibilidad({ fecha, hora_inicio: inicio, hora_fin: fin, estado });
      setFecha('');
      setInicio('');
      setFin('');
      setEstado('disponible');
      await load();
    } catch {
      setError('No se pudo crear la disponibilidad');
    } finally {
      setLoading(false);
    }
  }

  async function onSave(id) {
    setLoading(true);
    setError('');
    try {
      const original = items.find((d) => d.id_disponibilidad === id);
      if (original && original.estado !== editEstado) {
        await cambiarEstadoDisponibilidad(Number(id), editEstado);
      }
      await actualizarDisponibilidad(Number(id), {
        fecha: editFecha,
        hora_inicio: editInicio,
        hora_fin: editFin,
        estado: editEstado,
      });
      setEditId(null);
      await load();
    } catch {
      setError('No se pudo actualizar');
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id) {
    setLoading(true);
    setError('');
    try {
      await eliminarDisponibilidad(Number(id));
      await load();
    } catch {
      setError('No se pudo eliminar');
    } finally {
      setLoading(false);
    }
  }

  // Badge de estado
  const getEstadoBadge = (est) => {
    const base = 'px-3 py-1 rounded-full text-xs font-semibold';
    if (est === 'disponible') return `${base} bg-green-100 text-green-800`;
    if (est === 'ocupado') return `${base} bg-red-100 text-red-800`;
    return `${base} bg-gray-100 text-gray-800`;
  };

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
              🩺 Veterinario
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Gestión de disponibilidad
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
              Administra tus horarios disponibles para citas. Crea, edita o elimina bloques de tiempo.
            </p>
          </div>
        </div>
      </Hero>

      {/* Contenido principal */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Columna izquierda: formulario de nueva disponibilidad */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Nueva disponibilidad</h3>
              <form onSubmit={onCreate} className="space-y-4">
                <TextInput
                  label="Fecha"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
                <TextInput
                  label="Hora inicio"
                  type="time"
                  value={inicio}
                  onChange={(e) => setInicio(e.target.value)}
                  required
                />
                <TextInput
                  label="Hora fin"
                  type="time"
                  value={fin}
                  onChange={(e) => setFin(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="ocupado">Ocupado</option>
                  </select>
                </div>
                <div className="pt-4">
                  <Button type="submit" disabled={loading} size="large" className="w-full">
                    {loading ? 'Guardando...' : 'Crear disponibilidad'}
                  </Button>
                </div>
              </form>
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
              )}
            </div>

            {/* Columna derecha: listado de disponibilidades */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Mis horarios</h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {items.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">No hay disponibilidades registradas.</p>
                ) : (
                  items.map((d) => {
                    const id = d.id_disponibilidad;
                    const isEdit = editId === id;
                    return (
                      <div
                        key={id}
                        className="bg-gray-50 rounded-2xl p-5 border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        {!isEdit ? (
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className={getEstadoBadge(d.estado)}>
                                  {d.estado || 'disponible'}
                                </span>
                                <span className="text-sm text-gray-500">ID: {id}</span>
                              </div>
                              <p className="font-semibold text-gray-900">{d.fecha}</p>
                              <p className="text-gray-600">
                                {d.hora_inicio} – {d.hora_fin}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditId(id);
                                  setEditFecha(d.fecha);
                                  setEditInicio(d.hora_inicio);
                                  setEditFin(d.hora_fin);
                                  setEditEstado(d.estado ?? 'disponible');
                                }}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => onDelete(id)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <TextInput
                              label="Fecha"
                              type="date"
                              value={editFecha}
                              onChange={(e) => setEditFecha(e.target.value)}
                            />
                            <TextInput
                              label="Hora inicio"
                              type="time"
                              value={editInicio}
                              onChange={(e) => setEditInicio(e.target.value)}
                            />
                            <TextInput
                              label="Hora fin"
                              type="time"
                              value={editFin}
                              onChange={(e) => setEditFin(e.target.value)}
                            />
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estado
                              </label>
                              <select
                                value={editEstado}
                                onChange={(e) => setEditEstado(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              >
                                <option value="disponible">Disponible</option>
                                <option value="ocupado">Ocupado</option>
                              </select>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() => onSave(id)}
                                disabled={loading}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                              >
                                {loading ? 'Guardando...' : 'Guardar'}
                              </button>
                              <button
                                onClick={() => setEditId(null)}
                                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}