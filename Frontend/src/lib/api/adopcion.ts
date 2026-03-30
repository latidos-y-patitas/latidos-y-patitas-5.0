import { request, getUser } from './http';

export interface Mascota {
  id_mascota?: number;
  id?: number;
  nombre?: string;
  especie?: string;
  id_especie?: number | string;
  sexo?: string;
  id_sexo?: number | string;
  imagen?: string;
  raza?: string;
  edad?: number | string;
  descripcion?: string;
  estado?: string;
  fecha_publicacion?: string;
  id_admin?: number;
}

export interface Especie {
  id_especie: number;
  nombre: string;
  activo?: boolean;
}

export interface Sexo {
  id_sexo: number;
  nombre: string;
  activo?: boolean;
}

export interface MascotaPayload {
  nombre?: string;
  id_especie?: number | string;
  id_sexo?: number | string;
  raza?: string;
  edad?: number | string;
  descripcion?: string;
  estado?: string;
  imagen?: File | string;
  imagenBase64?: string;
  [key: string]: unknown;
}

export interface SolicitudAdopcionPayload {
  id_cliente?: number;
  id_mascota?: number;
  motivo?: string;
  direccion?: string;
  tiene_mascotas?: boolean;
  experiencia?: string;
  fecha_solicitud?: string;
  estado?: string;
}

function toFormData(payload: MascotaPayload): FormData {
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === 'imagenBase64' && typeof value === 'string') {
      form.append('imagen', value);
      return;
    }
    if (value instanceof File) {
      form.append(key, value);
      return;
    }
    form.append(key, String(value));
  });
  return form;
}

export async function listarMascotas(params?: Record<string, string>): Promise<Mascota[]> {
  const base = import.meta.env.VITE_API_BASE_URL || '/api';
  const url = new URL(`${base}/mascotas`, window.location.origin);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Error al listar mascotas');
  return res.json();
}

export async function obtenerMascota(id: number): Promise<Mascota> {
  return request<Mascota>('GET', `/mascotas/${id}`);
}

export async function crearMascota(payload: MascotaPayload): Promise<Mascota> {
  const base = import.meta.env.VITE_API_BASE_URL || '/api';
  const form = toFormData(payload);
  const res = await fetch(`${base}/mascotas`, {
    method: 'POST',
    body: form,
    credentials: 'include',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error((error as any)?.message ?? 'Error al crear mascota');
  }
  return res.json();
}

export async function actualizarMascota(id: number, payload: MascotaPayload): Promise<Mascota> {
  const base = import.meta.env.VITE_API_BASE_URL || '/api';
  const form = toFormData(payload);
  const res = await fetch(`${base}/mascotas/${id}`, {
    method: 'POST',
    body: form,
    credentials: 'include',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error((error as any)?.message ?? 'Error al actualizar mascota');
  }
  return res.json();
}

export async function eliminarMascota(id: number): Promise<void> {
  await request<void>('DELETE', `/mascotas/${id}`, undefined, { auth: true });
}

export async function listarMisMascotas(idUsuario: number): Promise<Mascota[]> {
  return request<Mascota[]>('GET', `/usuarios/${idUsuario}/mascotas`);
}

export async function listarEspecies(): Promise<Especie[]> {
  try {
    const raw = await request<any>('GET', '/especies');
    const list = Array.isArray(raw) ? raw : raw?.data ?? raw?.items ?? raw?.especies ?? [];
    return list.map((e: any) =>
      typeof e === 'string'
        ? { id_especie: undefined as any, nombre: e }
        : { id_especie: e?.id_especie ?? e?.id, nombre: e?.nombre ?? e?.label, activo: e?.activo }
    );
  } catch {
    const mascotas = await listarMascotas();
    const nombres = [...new Set(mascotas.map((m) => m.especie).filter(Boolean))];
    return nombres.map((n) => ({ id_especie: undefined as any, nombre: n! }));
  }
}

export async function listarSexos(): Promise<Sexo[]> {
  try {
    const raw = await request<any>('GET', '/sexos');
    const list = Array.isArray(raw) ? raw : raw?.data ?? raw?.items ?? raw?.sexos ?? [];
    return list.map((s: any) =>
      typeof s === 'string'
        ? { id_sexo: undefined as any, nombre: s }
        : { id_sexo: s?.id_sexo ?? s?.id, nombre: s?.nombre ?? s?.label, activo: s?.activo }
    );
  } catch {
    return [];
  }
}

export async function adoptarMascota(
  idMascota: number,
  payload: Partial<SolicitudAdopcionPayload> = {}
): Promise<unknown> {
  try {
    return await request('POST', `/mascotas/${idMascota}/adoptar`, payload, { auth: true });
  } catch {
    return crearSolicitudAdopcion({ id_mascota: idMascota, ...payload });
  }
}

export async function crearSolicitudAdopcion(
  payload: Partial<SolicitudAdopcionPayload>
): Promise<unknown> {
  const u = getUser();
  const body = {
    id_cliente: u?.id ?? u?.id_usuario,
    id_mascota: Number(payload.id_mascota),
    motivo: String(payload.motivo ?? ''),
    direccion: payload.direccion,
    tiene_mascotas: payload.tiene_mascotas ?? false,
    experiencia: payload.experiencia,
    fecha_solicitud: payload.fecha_solicitud,
    estado: payload.estado ?? 'pendiente',
  };
  return request('POST', '/solicitudes-adopcion', body, { auth: true });
}

export async function listarSolicitudesPendientes(): Promise<SolicitudAdopcionPayload[]> {
  try {
    return await request('GET', '/admin/solicitudes-adopcion/pendientes', undefined, { auth: true });
  } catch {
    return request('GET', '/solicitudes-adopcion?estado=pendiente', undefined, { auth: true });
  }
}

export async function cambiarEstadoSolicitud(id: number, estado: string): Promise<unknown> {
  const e = estado.toLowerCase();
  const isApprove = e.includes('aproba') || e.includes('acept');
  const isReject = e.includes('rechaz') || e.includes('cancel');
  const normalized = isApprove ? 'aprobada' : isReject ? 'rechazada' : estado;

  try {
    return await request('PATCH', `/solicitudes-adopcion/${id}/estado`, { estado: normalized }, { auth: true });
  } catch {
    if (isApprove) return request('POST', `/solicitudes-adopcion/${id}/aprobar`, undefined, { auth: true });
    if (isReject) return request('POST', `/solicitudes-adopcion/${id}/rechazar`, undefined, { auth: true });
    return request('PATCH', `/solicitudes-adopcion/${id}`, { estado: normalized }, { auth: true });
  }
}