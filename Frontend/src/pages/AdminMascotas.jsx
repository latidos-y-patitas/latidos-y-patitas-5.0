import { useEffect, useState } from 'react';
import Header from '../Components/Header.jsx';
import Hero from '../Components/Hero.jsx';
import TextInput from '../Components/TextInput.jsx';
import Button from '../Components/Button.jsx';
import { listarMascotas, crearMascota, actualizarMascota, eliminarMascota } from '../lib/api/adopcion';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop';

export default function AdminMascotas() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ── Formulario de creación ──────────────────────────────────────────────────
  const [nombre, setNombre] = useState('');
  const [idEspecie, setIdEspecie] = useState('');
  const [idSexo, setIdSexo] = useState('');
  const [raza, setRaza] = useState('');
  const [edad, setEdad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenFile, setImagenFile] = useState(null);

  // ── Datos para selects ─────────────────────────────────────────────────────
  const [especies, setEspecies] = useState([]);
  const [sexos, setSexos] = useState([]);

  // ── Estado de edición inline ───────────────────────────────────────────────
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editIdEspecie, setEditIdEspecie] = useState('');
  const [editIdSexo, setEditIdSexo] = useState('');
  const [editRaza, setEditRaza] = useState('');
  const [editEdad, setEditEdad] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editImagenFile, setEditImagenFile] = useState(null);

  // ── Carga de datos ─────────────────────────────────────────────────────────

  async function load() {
    setError('');
    try {
      const data = await listarMascotas();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError('No se pudieron cargar las mascotas');
    }
  }

  async function loadOpciones() {
  try {
    // ✅ URLs relativas — pasan por el proxy de Vite
    const [resEspecies, resSexos] = await Promise.all([
      fetch('/api/especies'),
      fetch('/api/sexos'),
    ]);
    setEspecies(await resEspecies.json());
    setSexos(await resSexos.json());
  } catch (err) {
    console.error('Error cargando selects', err);
  }
}

  useEffect(() => {
    load();
    loadOpciones();
  }, []);

  // ── Crear mascota ──────────────────────────────────────────────────────────

  async function onCreate(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        nombre,
        id_especie: idEspecie,
        id_sexo: idSexo,
        raza,
        ...(edad !== '' && { edad: Number(edad) }),
        descripcion,
        ...(imagenFile && { imagen: imagenFile }),
      };

      await crearMascota(payload);
      setSuccess('Mascota agregada correctamente');

      // Resetear formulario
      setNombre('');
      setIdEspecie('');
      setIdSexo('');
      setRaza('');
      setEdad('');
      setDescripcion('');
      setImagenFile(null);

      await load();
    } catch {
      setError('No se pudo crear la mascota');
    } finally {
      setLoading(false);
    }
  }

  // ── Guardar edición ────────────────────────────────────────────────────────

  async function onSaveEdit(id) {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        nombre: editNombre,
        id_especie: editIdEspecie,
        id_sexo: editIdSexo,
        raza: editRaza,
        ...(editEdad !== '' && { edad: Number(editEdad) }),
        descripcion: editDescripcion,
        ...(editImagenFile && { imagen: editImagenFile }),
      };

      await actualizarMascota(Number(id), payload);
      setEditId(null);
      setSuccess('Mascota actualizada correctamente');
      await load();
    } catch {
      setError('No se pudo actualizar la mascota');
    } finally {
      setLoading(false);
    }
  }

  // ── Eliminar mascota ───────────────────────────────────────────────────────

  async function onDelete(id) {
    if (!window.confirm('¿Estás seguro de eliminar esta mascota?')) return;
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await eliminarMascota(Number(id));
      setSuccess('Mascota eliminada correctamente');
      await load();
    } catch {
      setError('No se pudo eliminar la mascota');
    } finally {
      setLoading(false);
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  // Ahora imagen ya viene como URL completa de Cloudinary desde la API
  function resolveImage(src) {
    if (!src || typeof src !== 'string') return FALLBACK_IMG;
    // URL de Cloudinary o cualquier https: se usa directa
    if (/^https?:\/\//i.test(src)) return src;
    // Fallback para registros legacy con path local
    const path = src.replace(/^public\//, '').replace(/^\/?/, '/');
    const target = (import.meta.env.VITE_API_TARGET || '').replace(/\/+$/, '');
    return target ? `${target}${path}` : path;
  }

  const getEspecieNombre = (id) =>
    especies.find((e) => e.id_especie === id)?.nombre || 'Desconocida';

  const getSexoNombre = (id) =>
    sexos.find((s) => s.id_sexo === id)?.nombre || 'Desconocido';

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <Hero
        full
        backgroundImage="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1950&q=80"
      >
        <div className="flex items-center justify-center min-h-[50vh] px-4">
          <div className="bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl max-w-3xl border border-white/30 text-center">
            <span className="inline-block bg-emerald-100 text-emerald-800 px-5 py-2 rounded-full text-sm font-semibold mb-5 shadow-sm">
              🐾 Administración
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Mascotas en adopción
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
              Gestiona el catálogo de mascotas disponibles para adopción.
            </p>
          </div>
        </div>
      </Hero>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">

          {/* Mensajes globales */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl max-w-6xl mx-auto">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl max-w-6xl mx-auto">
              <p className="text-green-600 text-sm text-center">{success}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">

            {/* ── Formulario de creación ───────────────────────────────────── */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Agregar nueva mascota</h3>

              <form onSubmit={onCreate} className="space-y-4">
                <TextInput
                  label="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Especie</label>
                  <select
                    value={idEspecie}
                    onChange={(e) => setIdEspecie(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Seleccione especie</option>
                    {especies.map((e) => (
                      <option key={e.id_especie} value={e.id_especie}>
                        {e.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                  <select
                    value={idSexo}
                    onChange={(e) => setIdSexo(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Seleccione sexo</option>
                    {sexos.map((s) => (
                      <option key={s.id_sexo} value={s.id_sexo}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <TextInput
                  label="Raza"
                  value={raza}
                  onChange={(e) => setRaza(e.target.value)}
                />

                <TextInput
                  label="Edad (años)"
                  type="number"
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImagenFile(e.target.files[0] ?? null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                  {imagenFile && (
                    <p className="mt-1 text-xs text-emerald-600">
                      Archivo seleccionado: {imagenFile.name}
                    </p>
                  )}
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={loading} size="large" className="w-full">
                    {loading ? 'Guardando...' : 'Agregar mascota'}
                  </Button>
                </div>
              </form>
            </div>

            {/* ── Listado de mascotas ──────────────────────────────────────── */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Mascotas registradas</h3>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {items.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">No hay mascotas registradas.</p>
                ) : (
                  items.map((m) => {
                    const id = m.id_mascota;
                    const isEdit = editId === id;

                    return (
                      <div
                        key={id}
                        className="bg-gray-50 rounded-2xl p-5 border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        {!isEdit ? (
                          /* ── Vista de solo lectura ── */
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                              <img
                                src={resolveImage(m.imagen)}
                                alt={m.nombre}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                              />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-bold text-gray-900">{m.nombre}</span>
                                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                  {getEspecieNombre(m.id_especie)}
                                </span>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                  {getSexoNombre(m.id_sexo)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {m.raza && <><span className="font-medium">Raza:</span> {m.raza}</>}
                                {m.edad && <span> • {m.edad} años</span>}
                              </p>
                              {m.descripcion && (
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{m.descripcion}</p>
                              )}
                            </div>

                            <div className="flex gap-2 mt-2 sm:mt-0 sm:flex-col">
                              <button
                                onClick={() => {
                                  setEditId(id);
                                  setEditNombre(m.nombre || '');
                                  setEditIdEspecie(m.id_especie || '');
                                  setEditIdSexo(m.id_sexo || '');
                                  setEditRaza(m.raza || '');
                                  setEditEdad(m.edad || '');
                                  setEditDescripcion(m.descripcion || '');
                                  setEditImagenFile(null);
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
                          /* ── Formulario de edición inline ── */
                          <div className="space-y-4">
                            <TextInput
                              label="Nombre"
                              value={editNombre}
                              onChange={(e) => setEditNombre(e.target.value)}
                            />

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Especie</label>
                              <select
                                value={editIdEspecie}
                                onChange={(e) => setEditIdEspecie(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              >
                                <option value="">Seleccione especie</option>
                                {especies.map((e) => (
                                  <option key={e.id_especie} value={e.id_especie}>
                                    {e.nombre}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                              <select
                                value={editIdSexo}
                                onChange={(e) => setEditIdSexo(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              >
                                <option value="">Seleccione sexo</option>
                                {sexos.map((s) => (
                                  <option key={s.id_sexo} value={s.id_sexo}>
                                    {s.nombre}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <TextInput
                              label="Raza"
                              value={editRaza}
                              onChange={(e) => setEditRaza(e.target.value)}
                            />

                            <TextInput
                              label="Edad (años)"
                              type="number"
                              value={editEdad}
                              onChange={(e) => setEditEdad(e.target.value)}
                            />

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                              <textarea
                                value={editDescripcion}
                                onChange={(e) => setEditDescripcion(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nueva imagen (opcional)
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setEditImagenFile(e.target.files[0] ?? null)}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                              />
                              {editImagenFile && (
                                <p className="mt-1 text-xs text-emerald-600">
                                  Archivo seleccionado: {editImagenFile.name}
                                </p>
                              )}
                            </div>

                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() => onSaveEdit(id)}
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