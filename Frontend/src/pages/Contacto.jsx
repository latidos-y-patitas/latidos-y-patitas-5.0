import { useState } from 'react';
import Header from '../Components/Header.jsx';
import Hero from '../Components/Hero.jsx';
import TextInput from '../Components/TextInput.jsx';
import Button from '../Components/Button.jsx';
import { request } from '../lib/api/http';

export default function Contacto() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const body = { nombre, email, mensaje };
      if (asunto) body.asunto = asunto;
      await request('POST', '/contacto', body);
      setSuccess('Mensaje enviado, pronto nos pondremos en contacto');
      setNombre('');
      setEmail('');
      setAsunto('');
      setMensaje('');
    } catch (err) {
      const details = err?.details;
      if (details && details.error) {
        const parts = [];
        for (const val of Object.values(details.error)) {
          if (Array.isArray(val)) parts.push(...val);
          else if (val) parts.push(String(val));
        }
        if (parts.length > 0) {
          setError(parts.join(' '));
        } else {
          setError('No se pudo enviar el mensaje');
        }
      } else {
        setError('No se pudo enviar el mensaje');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <Hero
        full
        backgroundImage="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1950&q=80"
      >
        <div className="flex items-center justify-center min-h-[50vh] px-4">
          <div className="bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl max-w-3xl border border-white/30 text-center">
            <span className="inline-block bg-emerald-100 text-emerald-800 px-5 py-2 rounded-full text-sm font-semibold mb-5 shadow-sm">
              📬 Contáctanos
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Estamos para ayudarte
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
              Escríbenos para agendar citas, adoptar o resolver tus dudas. Te responderemos a la brevedad.
            </p>
          </div>
        </div>
      </Hero>

      {/* Sección de contacto: formulario + información */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Columna izquierda: información de contacto */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-emerald-50 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Información de contacto</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 text-xl">📍</span>
                    <div>
                      <p className="font-medium text-gray-900">Dirección</p>
                      <p className="text-gray-600">Calle 123 #45-67, Bogotá, Colombia</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 text-xl">📞</span>
                    <div>
                      <p className="font-medium text-gray-900">Teléfono</p>
                      <p className="text-gray-600">+57 601 234 5678</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 text-xl">✉️</span>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">contacto@latidosypatitas.com</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 text-xl">🕒</span>
                    <div>
                      <p className="font-medium text-gray-900">Horario de atención</p>
                      <p className="text-gray-600">Lun a Vie: 8:00 AM - 7:00 PM</p>
                      <p className="text-gray-600">Sáb: 9:00 AM - 5:00 PM</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Redes sociales (opcional) */}
              <div className="bg-emerald-50 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Síguenos</h3>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition-colors">f</a>
                  <a href="#" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition-colors">t</a>
                  <a href="#" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition-colors">ig</a>
                </div>
              </div>
            </div>

            {/* Columna derecha: formulario */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un mensaje</h3>
                <form onSubmit={onSubmit} className="space-y-4">
                  <TextInput
                    label="Nombre completo"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    name="nombre"
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
                    label="Asunto (opcional)"
                    value={asunto}
                    onChange={(e) => setAsunto(e.target.value)}
                    name="asunto"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensaje
                    </label>
                    <textarea
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                      name="mensaje"
                      rows={5}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
                    />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" disabled={loading} size="large" className="w-full">
                      {loading ? 'Enviando...' : 'Enviar mensaje'}
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
        </div>
      </section>

    </div>
  );
}