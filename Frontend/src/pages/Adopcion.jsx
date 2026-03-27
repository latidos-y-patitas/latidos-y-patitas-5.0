import { useEffect, useState } from 'react';
import Header from '../Components/Header.jsx';
import Hero from '../Components/Hero.jsx';
import Button from '../Components/Button.jsx';
import { listarMascotas } from '../lib/api/adopcion';

export default function Adopcion() {
  const [items, setItems] = useState([]);

  // Función para resolver la URL de la imagen (mantenida igual)
  // IMAGEN DE PERROS INFINITODS donde sale "Const fallback"
  function resolveImage(src) {
    const fallback = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop';
    if (!src || typeof src !== 'string') return fallback;
    if (/^https?:\/\//i.test(src)) return src;
    let path = src.replace(/^public\//, '');
    if (!path.startsWith('/')) path = '/' + path;
    const target = import.meta.env.VITE_API_TARGET || '';
    if (target) {
      const base = String(target).replace(/\/+$/, '');
      return `${base}${path}`;
    }
    return path;
  }

  // Función para refrescar datos desde API
async function refresh() {
  try {
    const data = await listarMascotas();
    if (Array.isArray(data) && data.length > 0) {
      // ✅ Excluir adoptadas y cualquier estado no disponible
      const available = data.filter((m) => {
        const estado = String(m?.estado ?? '').toLowerCase();
        return estado === 'disponible' || estado === '';
      });

      const mapped = available.map((m) => ({
        id: m?.id_mascota ?? m?.id,
        nombre: m?.nombre ?? 'Mascota',
        especie: m?.especie ?? 'Desconocida',
        raza: m?.raza ?? '—',
        edad: m?.edad != null ? `${m.edad} años` : '—',
        descripcion: m?.descripcion ?? '',
        foto: resolveImage(m?.imagen ?? m?.foto),
      }));

      setItems(mapped.length > 0 ? mapped : []);
    }
  } catch {}
}

  useEffect(() => {
    refresh();
    function onUpdate() { refresh(); }
    window.addEventListener('mascotas:updated', onUpdate);
    return () => window.removeEventListener('mascotas:updated', onUpdate);
  }, []);

  // Función para manejar la adopción (redirige a solicitud)
const handleAdoptar = (mascota) => {
  try {
    localStorage.setItem('selected_mascota_nombre', mascota.nombre);
    localStorage.setItem('selected_mascota_especie', mascota.especie);
    // ✅ Guardar id para la solicitud
    if (mascota.id) localStorage.setItem('selected_mascota_id', String(mascota.id));
  } catch {}
  const params = new URLSearchParams();
  params.set('mascota', mascota.nombre || '');
  if (mascota.especie) params.set('especie', mascota.especie);
  if (mascota.id) params.set('id_mascota', String(mascota.id));
  window.location.hash = `solicitud-adopcion?${params.toString()}`;
};

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <Hero
        full
        backgroundImage="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1950&q=80"
      >
        <div className="flex items-center justify-center min-h-[50vh] px-4">
          <div className="bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl max-w-3xl border border-white/30 text-center">
            <span className="inline-block bg-emerald-100 text-emerald-800 px-5 py-2 rounded-full text-sm font-semibold mb-5 shadow-sm">
              🐾 Adopción responsable
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Encuentra a tu <span className="text-emerald-600">compañero ideal</span>
            </h1>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Todos nuestros animales están vacunados, desparasitados y listos para llenar tu hogar de amor.
            </p>
          </div>
        </div>
      </Hero>

      {/* Sección de mascotas */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-4">
          {/* Encabezado */}
          <div className="text-center mb-16">
            <span className="text-emerald-700 font-semibold text-sm uppercase tracking-wider bg-emerald-100 px-5 py-2 rounded-full">
              ADOPCIÓN
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6 mb-4">
              Mascotas que esperan por ti
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Conoce a cada uno de ellos y dales una segunda oportunidad
            </p>
          </div>

          {/* Grid de tarjetas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((mascota, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                {/* Imagen con badge de especie */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={mascota.foto}
                    alt={mascota.nombre}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold uppercase shadow-lg ${
                    mascota.especie?.toLowerCase() === 'perro' ? 'bg-blue-100 text-blue-800' :
                    mascota.especie?.toLowerCase() === 'gato' ? 'bg-purple-100 text-purple-800' :
                    mascota.especie?.toLowerCase() === 'conejo' ? 'bg-pink-100 text-pink-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {mascota.especie || 'Mascota'}
                  </span>
                </div>

                {/* Información */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{mascota.nombre}</h3>
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Raza:</span>{' '}
                      <span className="font-medium text-gray-800">{mascota.raza || '—'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Edad:</span>{' '}
                      <span className="font-medium text-gray-800">{mascota.edad || '—'}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {mascota.descripcion || 'Sin descripción disponible'}
                  </p>

                  {/* Botón de adopción */}
                  <Button
                    onClick={() => handleAdoptar(mascota)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-colors shadow-md hover:shadow-lg"
                  >
                    Adoptar a {mascota.nombre}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}