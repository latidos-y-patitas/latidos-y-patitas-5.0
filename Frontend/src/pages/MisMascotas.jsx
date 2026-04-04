import { useEffect, useState } from 'react'
import Header from '../Components/Header.jsx'
import Hero from '../Components/Hero.jsx'
import { listarMisMascotas, descargarCertificadoPdf } from '../lib/api/adopcion'
import { getUser } from '../lib/api/http'


const base = import.meta.env.VITE_API_TARGET || ''

export default function MisMascotas() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [descargando, setDescargando] = useState(null)

  useEffect(() => {
    const u = getUser()
    const uid = u?.id ?? u?.id_usuario
    if (!uid) {
      setError('Debes iniciar sesión para ver tus mascotas')
      return
    }
    listarMisMascotas(uid)
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudieron cargar tus mascotas'))
  }, [])

async function descargarCertificado(idSolicitud, nombreMascota) {
  setDescargando(idSolicitud)
  try {
    const blob = await descargarCertificadoPdf(idSolicitud)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `certificado-${(nombreMascota ?? 'mascota').toLowerCase().replace(/\s+/g, '-')}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Error certificado:', err)
    alert('No se pudo descargar el certificado.')
  } finally {
    setDescargando(null)
  }
}

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <Hero full backgroundImage="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1950&q=80">
        <div className="flex items-center justify-center min-h-[50vh] px-4">
          <div className="bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl max-w-3xl border border-white/30 text-center">
            <span className="inline-block bg-emerald-100 text-emerald-800 px-5 py-2 rounded-full text-sm font-semibold mb-5 shadow-sm">
              🐾 Mi perfil
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Mis mascotas</h2>
            <p className="text-gray-600 text-lg">Mascotas que has adoptado</p>
          </div>
        </div>
      </Hero>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">

          {error && (
            <p className="text-center text-red-500 mb-8">{error}</p>
          )}

          {items.length === 0 && !error && (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">🐾</p>
              <p className="text-gray-500 text-lg">Aún no has adoptado ninguna mascota.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((m, i) => {
              const id = m?.id_mascota ?? m?.id
              const idSolicitud = m?.id_solicitud

              return (
                <article
                  key={id ?? i}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Imagen */}
                  {m?.imagen && (
                    <div className="h-48 overflow-hidden bg-gray-100">
                      <img
                        src={m.imagen}
                        alt={m.nombre}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                    </div>
                  )}

                  <div className="p-5">
                    <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full mb-2">
                      ✓ Adoptada
                    </span>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{m?.nombre ?? 'Mascota'}</h3>

                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      {m?.especie && <p><span className="font-medium">Especie:</span> {m.especie}</p>}
                      {m?.raza    && <p><span className="font-medium">Raza:</span> {m.raza}</p>}
                      {m?.edad    && <p><span className="font-medium">Edad:</span> {m.edad} años</p>}
                      {m?.fecha_adopcion && (
                        <p><span className="font-medium">Adoptada el:</span> {m.fecha_adopcion}</p>
                      )}
                    </div>

                    {/* Botón certificado */}
                    {idSolicitud && (
                      <button
                        onClick={() => descargarCertificado(idSolicitud, m?.nombre)}
                        disabled={descargando === idSolicitud}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
                      >
                        {descargando === idSolicitud
                          ? '⏳ Generando...'
                          : '📄 Descargar certificado'}
                      </button>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}