import { useEffect, useState } from 'react';
import Header from '../Components/Header.jsx';
import Hero from '../Components/Hero.jsx';
import TextInput from '../Components/TextInput.jsx';
import Button from '../Components/Button.jsx';
import { getUser } from '../lib/api/http';
import { updateProfile } from '../lib/api/auth';

export default function EditarPerfil() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const u = getUser();
    setName(u?.name ?? '');
    setEmail(u?.email ?? '');
    setTelefono(u?.telefono ?? '');
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await updateProfile({ name, email, telefono, password: password || undefined });
      setSuccess('Perfil actualizado correctamente');
      setPassword('');
    } catch {
      setError('No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <Hero
        full
        backgroundImage="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1950&q=80"
      >
        <div className="flex items-center justify-center min-h-[50vh] px-4">
          <div className="bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl max-w-3xl border border-white/30 text-center">
            <span className="inline-block bg-emerald-100 text-emerald-800 px-5 py-2 rounded-full text-sm font-semibold mb-5 shadow-sm">
              👤 Tu cuenta
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Editar perfil
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
              Actualiza tu información personal y contraseña.
            </p>
          </div>
        </div>
      </Hero>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Datos de usuario</h3>
            <form onSubmit={onSubmit} className="space-y-4">
              <TextInput
                label="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                name="name"
                required
              />
              <TextInput
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                required
              />
              <TextInput
                label="Teléfono"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                name="telefono"
              />
              <TextInput
                label="Nueva contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                placeholder="Opcional. Déjalo vacío si no deseas cambiarla"
              />
              <div className="pt-4">
                <Button type="submit" disabled={loading} size="large" className="w-full">
                  {loading ? 'Guardando...' : 'Guardar cambios'}
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
      </section>
    </div>
  );
}