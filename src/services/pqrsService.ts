import api from './api'
import { Pqrs } from '@/src/types'

export const pqrsService = {
  async getAll(): Promise<Pqrs[]> {
    const response = await api.get<{ data: Pqrs[] }>('/pqrs')
    return response.data.data
  },

  async getById(id: number): Promise<Pqrs> {
    const response = await api.get<{ data: Pqrs }>(`/pqrs/${id}`)
    return response.data.data
  },

  async create(data: FormData): Promise<Pqrs> {
    const response = await api.post<{ data: Pqrs }>('/pqrs', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  },

  getEstados(): string[] {
    return ['recibida', 'en_gestion', 'resuelta', 'cerrada']
  },

  getCategorias(): string[] {
    return ['peticion', 'queja', 'reclamo', 'sugerencia']
  },
}
