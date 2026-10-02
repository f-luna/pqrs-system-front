import api from './api'
import { AuthResponse, User } from '@/src/types'

export const authService = {
  async register(data: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }): Promise<string> {
    const response = await api.post<AuthResponse>('/register', data)
    const token = response.data.token
    localStorage.setItem('pqrs_token', token)
    document.cookie = 'pqrs_authenticated=true; path=/'
    return token
  },

  async login(data: { email: string; password: string }): Promise<string> {
    const response = await api.post<AuthResponse>('/login', data)
    const token = response.data.token
    localStorage.setItem('pqrs_token', token)
    document.cookie = 'pqrs_authenticated=true; path=/'
    return token
  },

  async logout(): Promise<void> {
    await api.post('/logout')
    localStorage.removeItem('pqrs_token')
    document.cookie = 'pqrs_authenticated=; path=/; max-age=0'
  },

  async getUser(): Promise<User> {
    const response = await api.get<{ data: User }>('/me')
    return response.data.data
  },
}
