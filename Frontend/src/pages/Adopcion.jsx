import { useEffect, useState } from 'react';
import Header from '../Components/Header.jsx';
import Hero from '../Components/Hero.jsx';
import Button from '../Components/Button.jsx';
import { listarMascotas } from '../lib/api/adopcion';
import '../styles/adopcion.css'; 

const mascotas = [
  {
    nombre: 'MAX',
    especie: 'Perro',
    raza: 'Labrador',
    edad: '2 años',
    descripcion: 'Max es un perro muy juguetón y cariñoso. Le encanta correr y jugar con pelotas.',
    foto: 'https://images.unsplash.com/photo-1519150268069-c094c2c0f4a0?q=80&w=800&auto=format&fit=crop'
  },
  {
    nombre: 'LUNA',
    especie: 'Gato',
    raza: 'Siamés',
    edad: '1 año',
    descripcion: 'Luna es una gata muy tranquila y cariñosa. Le gusta dormir en lugares cálidos.',
    foto: 'https://images.unsplash.com/photo-1593443320706-b57f62c3bafe?q=80&w=800&auto=format&fit=crop'
  },
  {
    nombre: 'COPITO',
    especie: 'Conejo',
    raza: 'Enano',
    edad: '1 año',
    descripcion: 'Copito es un conejo muy dócil y limpio. Es ideal para familias con niños.',
    foto: 'https://images.unsplash.com/photo-1540322530211-4775c61ab9b0?q=80&w=800&auto=format&fit=crop'
  }
];

export default function Adopcion() {
  const [items, setItems] = useState(mascotas);

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

  async function refresh() {
    try {
      const data = await listarMascotas();
      if (Array.isArray(data) && data.length > 0) {
        const available = data.filter((m) => {
          const estado = String(m?.estado ?? '').toLowerCase();
          if (!estado) return true;
          return estado.includes('disponible') || estado.includes('activo');
        });
        const mapped = (available.length > 0 ? available : data).map((m) => {
          const nombre = m?.nombre ?? 'Mascota';
          const especie = m?.especie ?? m?.especieRef?.nombre ?? 'Desconocida';
          const raza = m?.raza ?? '';
          const edadRaw = m?.edad;
          const edad = (typeof edadRaw === 'number' && Number.isFinite(edadRaw))
            ? String(edadRaw)
            : (edadRaw ?? '');
          const descripcion = m?.descripcion ?? '';
          const foto = resolveImage(m?.imagen ?? m?.foto);
          return { nombre, especie, raza, edad, descripcion, foto };
        });
        setItems(mapped);
      }
    } catch {}
  }

  useEffect(() => {
    refresh();
    function onUpdate() { refresh(); }
    window.addEventListener('mascotas:updated', onUpdate);
    return () => window.removeEventListener('mascotas:updated', onUpdate);
  }, []);

  return (
    <div className="adopcion-page">
      <Header />

      <Hero full>
        <div className="hero-contenido">
          <div className="hero-card">
            <span className="hero-badge">🐾 Adopción responsable</span>
            <h1 className="hero-titulo">
              Encuentra a tu <span>compañero ideal</span>
            </h1>
            <p className="hero-descripcion">
              Todos nuestros animales están vacunados, desparasitados y listos para llenar tu hogar de amor.
            </p>
          </div>
        </div>
      </Hero>

      <section className="mascotas-section">
        <div className="mascotas-container">
          <div className="seccion-header">
            <span className="seccion-badge">ADOPCIÓN</span>
            <h2>Mascotas que esperan por ti</h2>
            <p>Conoce a cada uno de ellos y dales una segunda oportunidad</p>
          </div>

          <div className="mascotas-grid">
            {items.map((m, index) => (
              <article key={m.nombre} className="mascota-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="mascota-imagen">
                  <img
                    src={m.foto}
                    alt={m.nombre}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                  <span className={`especie-badge especie-${m.especie?.toLowerCase() || 'otro'}`}>
                    {m.especie || 'Mascota'}
                  </span>
                </div>

                <div className="mascota-info">
                  <h3>{m.nombre}</h3>
                  <div className="mascota-detalles">
                    <p><strong>Raza:</strong> {m.raza || '—'}</p>
                    <p><strong>Edad:</strong> {m.edad || '—'}</p>
                  </div>
                  <p className="mascota-descripcion">{m.descripcion || 'Sin descripción disponible'}</p>

                  <div className="mascota-accion">
                    <Button
                      onClick={() => {
                        try {
                          localStorage.setItem('selected_mascota_nombre', m.nombre);
                          localStorage.setItem('selected_mascota_especie', m.especie);
                        } catch (e) {}
                        const q = new URLSearchParams();
                        q.set('mascota', m.nombre || '');
                        if (m.especie) q.set('especie', m.especie);
                        window.location.hash = 'solicitud-adopcion?' + q.toString();
                      }}
                    >
                      Adoptar
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}