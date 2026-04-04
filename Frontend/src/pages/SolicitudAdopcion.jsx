import { useEffect, useState } from 'react'
import Header from '../Components/Header.jsx'
import Hero from '../Components/Hero.jsx'
import Button from '../Components/Button.jsx'
import { listarMascotas, adoptarMascota } from '../lib/api/adopcion'
import { getUser } from '../lib/api/http'

export default function SolicitudAdopcion() {
  const [mascotas, setMascotas] = useState([])
  const [idMascota, setIdMascota] = useState('')
  const [motivo, setMotivo] = useState('')
  const [direccion, setDireccion] = useState('')
  const [tieneMascotas, setTieneMascotas] = useState(false)
  const [experiencia, setExperiencia] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const user = getUser()

  // ── Cargar mascotas ────────────────────────────────────────────────────────
  useEffect(() => {
    listarMascotas()
      .then((data) => setMascotas(Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudo cargar mascotas'))
  }, [])

  // ── Preseleccionar mascota desde URL o localStorage ────────────────────────
  useEffect(() => {
    if (mascotas.length === 0) return

    // 1. Intentar por id directo (más confiable)
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const q = hash.includes('?') ? hash.split('?')[1] : ''
    const params = new URLSearchParams(q)

    const idFromUrl = params.get('id_mascota') || ''
    const idFromStorage = (() => { try { return localStorage.getItem('selected_mascota_id') || '' } catch { return '' } })()
    const idPreset = idFromUrl || idFromStorage

    if (idPreset) {
      const match = mascotas.find((m) => String(m.id_mascota ?? m.id) === String(idPreset))
      if (match) {
        setIdMascota(String(match.id_mascota ?? match.id))
        return
      }
    }

    // 2. Fallback: buscar por nombre
    const nameFromUrl = params.get('mascota') || ''
    const nameFromStorage = (() => { try { return localStorage.getItem('selected_mascota_nombre') || '' } catch { return '' } })()
    const namePreset = nameFromUrl || nameFromStorage

    if (namePreset) {
      const match = mascotas.find((m) => (m.nombre ?? '').toLowerCase() === namePreset.toLowerCase())
      if (match) {
        setIdMascota(String(match.id_mascota ?? match.id))
      }
    }
  }, [mascotas])

  // ── Submit ─────────────────────────────────────────────────────────────────
  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!getUser()) {
      setError('Debes iniciar sesión para solicitar adopción')
      return
    }
    if (!idMascota) {
      setError('Selecciona una mascota')
      return
    }

    setLoading(true)
    try {
      const result = await adoptarMascota(Number(idMascota), {
        motivo,
        direccion,
        tiene_mascotas: tieneMascotas,
        experiencia,
      })

      let msg = 'Solicitud enviada correctamente'
      if (result?.fecha_solicitud) msg += ` (fecha: ${result.fecha_solicitud})`
      setSuccess(msg)

      // Limpiar localStorage
      try {
        localStorage.removeItem('selected_mascota_id')
        localStorage.removeItem('selected_mascota_nombre')
        localStorage.removeItem('selected_mascota_especie')
      } catch {}

      setIdMascota('')
      setMotivo('')
      setDireccion('')
      setTieneMascotas(false)
      setExperiencia('')
    } catch (err) {
      setError(typeof err?.message === 'string' ? err.message : 'Error al enviar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
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
              🐾 Adopción responsable
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Solicitud de adopción
            </h2>
            <p className="text-gray-600 text-lg">
              Completa el formulario para adoptar a tu nuevo compañero.
            </p>
          </div>
        </div>
      </Hero>

      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Completa tu solicitud</h3>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">

              {/* Selector de mascota — sin filtro por tipo para que siempre aparezca la preseleccionada */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mascota</label>
                <select
                  value={idMascota}
                  onChange={(e) => setIdMascota(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Selecciona una mascota</option>
                  {mascotas.map((m) => {
                    const id = m.id_mascota ?? m.id
                    return (
                      <option key={id} value={id}>
                        {m.nombre ?? 'Mascota'}{m.especie ? ` • ${m.especie}` : ''}
                      </option>
                    )
                  })}
                </select>
              </div>

              {/* Motivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo de adopción
                </label>
                <textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  rows={4}
                  placeholder="¿Por qué deseas adoptar a esta mascota?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
                />
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Calle #, Ciudad"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* ¿Tienes mascotas? */}
              <div className="flex items-center gap-3">
                <input
                  id="tieneMascotas"
                  type="checkbox"
                  checked={tieneMascotas}
                  onChange={(e) => setTieneMascotas(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="tieneMascotas" className="text-sm text-gray-700">
                  ¿Tienes otras mascotas en casa?
                </label>
              </div>

              {/* Experiencia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experiencia con mascotas
                </label>
                <textarea
                  value={experiencia}
                  onChange={(e) => setExperiencia(e.target.value)}
                  rows={4}
                  placeholder="Cuéntanos tu experiencia previa con animales..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Enviando...' : 'Solicitar adopción'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}