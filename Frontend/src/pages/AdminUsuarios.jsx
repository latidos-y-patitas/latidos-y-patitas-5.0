import { useEffect, useState } from 'react';
import Header from '../Components/Header.jsx';
import Hero from '../Components/Hero.jsx';
import TextInput from '../Components/TextInput.jsx';
import Button from '../Components/Button.jsx';
import { listarUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } from '../lib/api/users';

export default function AdminUsuarios() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Formulario creación
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idRol, setIdRol] = useState(3);

  // Edición
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editIdRol, setEditIdRol] = useState(3);

  async function load() {
    setError('');
    try {
      const data = await listarUsuarios();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError('No se pudo cargar usuarios');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await crearUsuario({ name, email, password, id_rol: Number(idRol) });
      setName('');
      setEmail('');
      setPassword('');
      setIdRol(3);
      await load();
      setSuccess('Usuario creado correctamente');
    } catch {
      setError('No se pudo crear el usuario');
    } finally {
      setLoading(false);
    }
  }

  async function onSaveEdit(id) {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await actualizarUsuario(Number(id), {
        nombre: editName,
        email: editEmail,
        id_rol: Number(editIdRol),
      });
      setEditId(null);
      await load();
      setSuccess('Usuario actualizado correctamente');
    } catch {
      setError('No se pudo actualizar el usuario');
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id) {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await eliminarUsuario(Number(id));
      await load();
      setSuccess('Usuario eliminado correctamente');
    } catch {
      setError('No se pudo eliminar el usuario');
    } finally {
      setLoading(false);
    }
  }

  // Badge según rol
  const getRolBadge = (rolId) => {
    const base = 'px-3 py-1 rounded-full text-xs font-semibold';
    if (rolId === 1) return `${base} bg-red-100 text-red-800`; // Admin
    if (rolId === 2) return `${base} bg-blue-100 text-blue-800`; // Veterinario
    return `${base} bg-green-100 text-green-800`; // Cliente
  };

  const getRolNombre = (rolId) => {
    if (rolId === 1) return 'Administrador';
    if (rolId === 2) return 'Veterinario';
    return 'Cliente';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <Hero
        full
        backgroundImage="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1950&q=80"
      >
        <div className="flex items-center justify-center min-h-[50vh] px-4">
          <div className="bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl max-w-3xl border border-white/30 text-center">
            <span className="inline-block bg-emerald-100 text-emerald-800 px-5 py-2 rounded-full text-sm font-semibold mb-5 shadow-sm">
              👥 Administración
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Usuarios del sistema
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
              Gestiona los perfiles de administradores, veterinarios y clientes.
            </p>
          </div>
        </div>
      </Hero>

      {/* Contenido principal */}
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
            {/* Columna izquierda: formulario de creación */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Crear nuevo usuario</h3>
              <form onSubmit={onCreate} className="space-y-4">
                <TextInput
                  label="Nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <TextInput
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <TextInput
                  label="Contraseña"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  <select
                    value={idRol}
                    onChange={(e) => setIdRol(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={1}>Administrador</option>
                    <option value={2}>Veterinario</option>
                    <option value={3}>Cliente</option>
                  </select>
                </div>
                <div className="pt-4">
                  <Button type="submit" disabled={loading} size="large" className="w-full">
                    {loading ? 'Creando...' : 'Crear usuario'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Columna derecha: listado de usuarios */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Usuarios registrados</h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {items.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">No hay usuarios registrados.</p>
                ) : (
                  items.map((u) => {
                    const id = u.id ?? u.id_usuario;
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
                                <span className={getRolBadge(u.id_rol)}>
                                  {getRolNombre(u.id_rol)}
                                </span>
                                <span className="text-sm text-gray-500">ID: {id}</span>
                              </div>
                              <p className="font-semibold text-gray-900">{u.nombre ?? u.name}</p>
                              <p className="text-gray-600 text-sm">{u.email}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditId(id);
                                  setEditName(u.nombre ?? u.name ?? '');
                                  setEditEmail(u.email ?? '');
                                  setEditIdRol(u.id_rol ?? 3);
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
                              label="Nombre"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                            />
                            <TextInput
                              label="Email"
                              type="email"
                              value={editEmail}
                              onChange={(e) => setEditEmail(e.target.value)}
                            />
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rol
                              </label>
                              <select
                                value={editIdRol}
                                onChange={(e) => setEditIdRol(Number(e.target.value))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              >
                                <option value={1}>Administrador</option>
                                <option value={2}>Veterinario</option>
                                <option value={3}>Cliente</option>
                              </select>
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