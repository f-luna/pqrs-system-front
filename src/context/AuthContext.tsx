'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { authService } from '@/src/services/authService'
import { User } from '@/src/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const clearSession = useCallback(() => {
    setUser(null)
    localStorage.removeItem('pqrs_token')
    document.cookie = 'pqrs_authenticated=; path=/; max-age=0'
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('pqrs_token')
    if (token) {
      authService
        .getUser()
        .then((userData) => {
          if (userData.role !== 'cliente') {
            clearSession()
          } else {
            setUser(userData)
          }
        })
        .catch(() => {
          clearSession()
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [clearSession])

  const login = async (email: string, password: string) => {
    await authService.login({ email, password })
    const userData = await authService.getUser()
    if (userData.role !== 'cliente') {
      await authService.logout()
      throw new Error('Este portal es solo para clientes.')
    }
    setUser(userData)
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ) => {
    await authService.register({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    })
    const userData = await authService.getUser()
    if (userData.role !== 'cliente') {
      await authService.logout()
      throw new Error('Este portal es solo para clientes.')
    }
    setUser(userData)
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch {
      // Limpiar sesión aunque falle la petición
    }
    clearSession()
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
