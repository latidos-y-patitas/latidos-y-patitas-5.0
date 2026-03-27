import { useState } from 'react';
import TextInput from '../Components/TextInput.jsx';
import Button from '../Components/Button.jsx';
import { register } from '../lib/api/auth';
import Header from '../Components/Header.jsx';
import Hero from '../Components/Hero.jsx';

export default function Registro() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== password2) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        name,
        email,
        password,
        password_confirmation: password2,
        telefono: phone,
      });
      setSuccess(user ? 'Registro exitoso' : 'Registro completado');
      if (user) {
        window.location.hash = 'inicio';
      }
    } catch (err) {
      setError(typeof err?.message === 'string' ? err.message : 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero full backgroundImage="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1950&q=80">
        <div className="flex items-center justify-center min-h-[70vh] px-4">
          <div className="bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/30">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
              Crear cuenta
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Únete a Latidos & Patitas
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <TextInput
                label="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                name="name"
                required
              />

              <TextInput
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@dominio.com"
                name="email"
                required
              />

              <TextInput
                label="Teléfono"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="300 123 4567"
                name="telefono"
              />

              <TextInput
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                name="password"
                required
              />

              <TextInput
                label="Confirmar contraseña"
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="••••••••"
                name="password_confirmation"
                required
              />

              <div className="pt-4">
                <Button type="submit" disabled={loading} size="large" className="w-full">
                  {loading ? 'Creando cuenta...' : 'Registrarse'}
                </Button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            {success && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-600 text-sm text-center">{success}</p>
              </div>
            )}

            <p className="mt-6 text-center text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <a href="#login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                Inicia sesión
              </a>
            </p>
          </div>
        </div>
      </Hero>
    </div>
  );
}