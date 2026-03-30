import { request, getUser } from './http'

export interface CitaPayload {
  id_cliente: number
  motivo: string
  id_disponibilidad?: number
  estado?: string
}

export interface Cita {
  id?: number
  fecha: string
  hora: string
  motivo?: string
  telefono?: string
  estado?: string
  id_veterinario?: number
  veterinario?: string
}

export async function crearCita(payload: Partial<CitaPayload>): Promise<Cita> {
  const u = getUser()
  const id_cliente = (u?.id ?? u?.id_usuario)
  const body: CitaPayload = {
    id_cliente,
    motivo: payload.motivo || '',
    id_disponibilidad: payload.id_disponibilidad,
    estado: payload.estado,
  }
  return await request<Cita>('POST', '/citas', body, { auth: true })
}

export async function listarCitas(): Promise<Cita[]> {
  return await request<Cita[]>('GET', '/citas', undefined, { auth: true })
}

export async function listarCitasDeCliente(clienteId: number): Promise<Cita[]> {
  try {
    return await request<Cita[]>('GET', `/usuarios/${clienteId}/citas`, undefined, { auth: true })
  } catch {
    try {
      return await request<Cita[]>('GET', `/clientes/${clienteId}/citas`, undefined, { auth: true })
    } catch {
      const all = await listarCitas()
      const list = Array.isArray(all) ? all : []
      return list.filter((c) => {
        const cid = (c as any)?.id_cliente ?? (c as any)?.cliente_id ?? (c as any)?.id_usuario
        return Number(cid) === Number(clienteId)
      })
    }
  }
}

export async function listarCitasPorVeterinario(vetId: number, estado?: string): Promise<Cita[]> {
  const qs = estado ? `?estado=${encodeURIComponent(estado)}` : ''
  try {
    return await request<Cita[]>('GET', `/veterinarios/${vetId}/citas${qs}`, undefined, { auth: true })
  } catch {
    const all = await listarCitas()
    let list = Array.isArray(all) ? all : []
    if (estado) {
      list = list.filter((c) => (c && (c.estado ?? '').toLowerCase()) === estado.toLowerCase())
    }
    return list.filter((c) => c && c.id_veterinario === vetId)
  }
}

export async function listarCitasAdmin(): Promise<any[]> {
  return await request<any[]>('GET', '/admin/citas', undefined, { auth: true })
}

export async function listarCitasActivasAdmin(): Promise<any[]> {
  return await request<any[]>('GET', '/admin/citas-activas', undefined, { auth: true })
}

export interface Disponibilidad {
  id_disponibilidad: number
  id_veterinario?: number
  fecha: string
  hora_inicio: string
  hora_fin: string
  estado?: string
}

export async function listarDisponibilidad(estado?: string): Promise<Disponibilidad[]> {
  const path = estado ? `/disponibilidad-citas?estado=${encodeURIComponent(estado)}` : '/disponibilidad-citas'
  return await request<Disponibilidad[]>('GET', path)
}

export async function listarEspeciesMascotas(): Promise<string[]> {
  try {
    return await request<string[]>('GET', '/citas/mascotas-especies')
  } catch {
    return ['Perro', 'Gato', 'Conejo', 'Otro']
  }
}

export async function crearDisponibilidad(payload: Partial<Disponibilidad>) {
  return await request('POST', '/disponibilidad-citas', payload, { auth: true })
}

export async function actualizarDisponibilidad(id: number, payload: Partial<Disponibilidad>) {
  return await request('PUT', `/disponibilidad-citas/${id}`, payload, { auth: true })
}

export async function cambiarEstadoDisponibilidad(id: number, estado: string) {
  try {
    return await request('PATCH', `/disponibilidad-citas/${id}/estado`, { estado }, { auth: true })
  } catch {
    return await request('PATCH', `/disponibilidad-citas/${id}`, { estado }, { auth: true })
  }
}

export async function confirmarCita(vetId: number, citaId: number) {
  try {
    return await request('POST', `/veterinarios/${vetId}/citas/${citaId}/confirmar`, undefined, { auth: true })
  } catch {
    return cambiarEstadoCita(citaId, 'confirmada')
  }
}

export async function cancelarCita(vetId: number, citaId: number) {
  try {
    return await request('POST', `/veterinarios/${vetId}/citas/${citaId}/cancelar`, undefined, { auth: true })
  } catch {
    return cambiarEstadoCita(citaId, 'cancelada')
  }
}

export async function eliminarDisponibilidad(id: number) {
  return await request('DELETE', `/disponibilidad-citas/${id}`, undefined, { auth: true })
}

export async function actualizarCita(id: number, payload: Partial<CitaPayload>) {
  return await request('PUT', `/citas/${id}`, payload, { auth: true })
}

export async function eliminarCita(id: number) {
  return await request('DELETE', `/citas/${id}`, undefined, { auth: true })
}

export async function cambiarEstadoCita(id: number, estado: string) {
  try {
    return await request('PATCH', `/citas/${id}/estado`, { estado }, { auth: true })
  } catch {
    return await request('PATCH', `/citas/${id}`, { estado }, { auth: true })
  }
}