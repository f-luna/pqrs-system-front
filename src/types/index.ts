export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'agente' | 'cliente'
  is_active: boolean
}

export interface Pqrs {
  id: number
  numero_radicado: string
  categoria: 'peticion' | 'queja' | 'reclamo' | 'sugerencia'
  asunto: string
  descripcion: string
  estado: 'recibida' | 'en_gestion' | 'resuelta' | 'cerrada'
  fecha_limite: string
  dias_habiles_usados: number
  respuesta_final: string | null
  cliente: User
  agente: User | null
  adjuntos: Adjunto[]
  historial: PqrsHistorial[]
  created_at: string
}

export interface Adjunto {
  id: number
  nombre_original: string
  ruta: string
  mime_type: string
  tamanio_kb: number
}

export interface PqrsHistorial {
  id: number
  estado_anterior: string | null
  estado_nuevo: string
  comentario: string | null
  usuario: User
  created_at: string
}

export interface AuthResponse {
  token: string
}
