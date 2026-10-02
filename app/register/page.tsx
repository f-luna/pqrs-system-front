'use client'

import { useState, FormEvent, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/context/AuthContext'
import AlertMessage from '@/src/components/AlertMessage'
import axios from 'axios'

function getPasswordStrength(password: string): { label: string; color: string; percent: number } {
  if (password.length === 0) return { label: '', color: '', percent: 0 }
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { label: 'Débil', color: 'bg-danger', percent: 25 }
  if (score === 2) return { label: 'Regular', color: 'bg-warning', percent: 50 }
  if (score === 3) return { label: 'Buena', color: 'bg-info', percent: 75 }
  return { label: 'Fuerte', color: 'bg-success', percent: 100 }
}

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [submitting, setSubmitting] = useState(false)
  const { register, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [loading, isAuthenticated, router])

  const strength = getPasswordStrength(password)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    if (!acceptTerms) {
      setError('Debes aceptar el tratamiento de datos personales.')
      return
    }

    setSubmitting(true)
    try {
      await register(name, email, password, passwordConfirmation)
      router.push('/dashboard')
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        setFieldErrors(err.response.data.errors || {})
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Ocurrió un error al crear la cuenta.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light py-4">
      <div className="card shadow" style={{ width: '100%', maxWidth: '480px' }}>
        <div className="card-body p-4">
          <h3 className="text-center fw-bold mb-4">Crear cuenta</h3>

          {error && <AlertMessage type="danger" message={error} />}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Nombre completo
              </label>
              <input
                type="text"
                className={`form-control ${fieldErrors.name ? 'is-invalid' : ''}`}
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {fieldErrors.name?.map((msg, i) => (
                <div className="invalid-feedback" key={i}>
                  {msg}
                </div>
              ))}
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Correo electrónico
              </label>
              <input
                type="email"
                className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {fieldErrors.email?.map((msg, i) => (
                <div className="invalid-feedback" key={i}>
                  {msg}
                </div>
              ))}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {fieldErrors.password?.map((msg, i) => (
                <div className="invalid-feedback" key={i}>
                  {msg}
                </div>
              ))}
              {strength.label && (
                <div className="mt-2">
                  <div className="progress" style={{ height: '6px' }}>
                    <div
                      className={`progress-bar ${strength.color}`}
                      style={{ width: `${strength.percent}%` }}
                    />
                  </div>
                  <small className="text-muted">Fortaleza: {strength.label}</small>
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="passwordConfirmation" className="form-label">
                Confirmar contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="passwordConfirmation"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="acceptTerms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <label className="form-check-label small" htmlFor="acceptTerms">
                Acepto el tratamiento de mis datos personales conforme a la Ley 1581 de
                2012
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mb-3"
              disabled={submitting}
            >
              {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>

            <p className="text-center mb-0">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login">Inicia sesión</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
