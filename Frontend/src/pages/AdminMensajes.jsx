import { useEffect, useState } from 'react';
import Header from '../Components/Header.jsx';
import Hero from '../Components/Hero.jsx';
import Button from '../Components/Button.jsx';
import { request } from '../lib/api/http';

export default function AdminMensajes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setError('');
    setLoading(true);
    try {
      let data = [];
      try {
        data = await request('GET', '/mensajes-contacto', undefined, { auth: true });
      } catch (err) {
        try {
          data = await request('GET', '/contact/messages', undefined, { auth: true });
        } catch {
          data = [];
        }
      }
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError('No se pudieron cargar los mensajes');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Formatear fecha si existe
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
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
              📬 Bandeja de entrada
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Mensajes de contacto
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
              Revisa los mensajes enviados por los usuarios desde el formulario de contacto.
            </p>
          </div>
        </div>
      </Hero>

      {/* Contenido principal */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Cabecera con contador y botón actualizar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-sm font-medium text-gray-500">Total de mensajes</span>
                <p className="text-3xl font-bold text-gray-900">{items.length}</p>
              </div>
              <Button onClick={load} disabled={loading} size="medium">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Cargando...
                  </span>
                ) : (
                  'Actualizar'
                )}
              </Button>
            </div>

            {/* Mensajes de error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Estado de carga inicial */}
            {loading && items.length === 0 && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            )}

            {/* Listado de mensajes */}
            {!loading && items.length === 0 && !error && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No hay mensajes por ahora.</p>
              </div>
            )}

            <div className="space-y-4">
              {items.map((m, index) => {
                const id = m.id ?? index;
                const nombre = m.nombre ?? m.name ?? 'Desconocido';
                const email = m.email ?? '';
                const mensaje = m.mensaje ?? m.message ?? '';
                const fecha = m.created_at ?? m.fecha ?? null;

                return (
                  <div
                    key={id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{nombre}</h3>
                          {email && (
                            <a
                              href={`mailto:${email}`}
                              className="text-emerald-600 hover:text-emerald-700 text-sm"
                            >
                              {email}
                            </a>
                          )}
                        </div>
                        {fecha && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {formatDate(fecha)}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {mensaje}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}