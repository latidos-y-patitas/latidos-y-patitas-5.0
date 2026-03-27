import { useState } from 'react';
import TextInput from '../Components/TextInput.jsx';
import Button from '../Components/Button.jsx';
import { login } from '../lib/api/auth';
import Header from '../Components/Header.jsx';
import Hero from '../Components/Hero.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const user = await login({ email, password });
      setSuccess(user ? 'Inicio de sesión exitoso' : 'Inicio de sesión completado');
      if (user) {
        window.location.hash = 'inicio';
      }
    } catch (err) {
      setError(typeof err?.message === 'string' ? err.message : 'Error al iniciar sesión');
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
              Bienvenido de nuevo
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Inicia sesión en tu cuenta
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                name="password"
                required
              />

              <div className="pt-4">
                <Button type="submit" disabled={loading} size="large" className="w-full">
                  {loading ? 'Ingresando...' : 'Iniciar sesión'}
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
              ¿No tienes una cuenta?{' '}
              <a href="#registro" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </Hero>
    </div>
  );
}