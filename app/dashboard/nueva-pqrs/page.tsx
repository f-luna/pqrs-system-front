'use client'

import { useState, FormEvent, useRef } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/src/components/DashboardLayout'
import AlertMessage from '@/src/components/AlertMessage'
import { pqrsService } from '@/src/services/pqrsService'
import axios from 'axios'

const categoriaDescripciones: Record<string, string> = {
  peticion: 'Solicitud de información o realización de una acción.',
  queja: 'Manifestación de insatisfacción sin exigir compensación económica.',
  reclamo: 'Exigencia de corrección, cambio o devolución por un producto o servicio.',
  sugerencia: 'Propuesta de mejora voluntaria para el servicio.',
}

const MAX_FILES = 3
const MAX_FILE_SIZE_MB = 5
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png']

export default function NuevaPqrsPage() {
  const [categoria, setCategoria] = useState('')
  const [asunto, setAsunto] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [adjuntos, setAdjuntos] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles: File[] = []
    const errors: string[] = []

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`"${file.name}" no es un formato válido (PDF, JPG, PNG).`)
        continue
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        errors.push(`"${file.name}" supera los ${MAX_FILE_SIZE_MB}MB.`)
        continue
      }
      validFiles.push(file)
    }

    const totalFiles = adjuntos.length + validFiles.length
    if (totalFiles > MAX_FILES) {
      errors.push(`Máximo ${MAX_FILES} archivos permitidos.`)
      validFiles.splice(MAX_FILES - adjuntos.length)
    }

    if (errors.length > 0) {
      setError(errors.join(' '))
    } else {
      setError('')
    }

    setAdjuntos((prev) => [...prev, ...validFiles])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeFile = (index: number) => {
    setAdjuntos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setSubmitting(true)

    const formData = new FormData()
    formData.append('categoria', categoria)
    formData.append('asunto', asunto)
    formData.append('descripcion', descripcion)
    adjuntos.forEach((file) => formData.append('adjuntos[]', file))

    try {
      const result = await pqrsService.create(formData)
      setSuccessMessage(
        `¡Tu solicitud fue registrada! Número de radicado: ${result.numero_radicado}`
      )
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        setFieldErrors(err.response.data.errors || {})
      } else {
        setError('Ocurrió un error al enviar la solicitud.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <h4 className="fw-bold mb-4">Nueva solicitud PQRS</h4>

      {successMessage ? (
        <div>
          <AlertMessage type="success" message={successMessage} />
          <button
            className="btn btn-primary"
            onClick={() => router.push('/dashboard')}
          >
            Ver mis solicitudes
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <AlertMessage type="danger" message={error} />}

          <div className="mb-3">
            <label htmlFor="categoria" className="form-label">
              Categoría
            </label>
            <select
              className={`form-select ${fieldErrors.categoria ? 'is-invalid' : ''}`}
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            >
              <option value="">Selecciona una categoría</option>
              <option value="peticion">Petición</option>
              <option value="queja">Queja</option>
              <option value="reclamo">Reclamo</option>
              <option value="sugerencia">Sugerencia</option>
            </select>
            {fieldErrors.categoria?.map((msg, i) => (
              <div className="invalid-feedback" key={i}>
                {msg}
              </div>
            ))}
            {categoria && (
              <div className="form-text">{categoriaDescripciones[categoria]}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="asunto" className="form-label">
              Asunto
            </label>
            <input
              type="text"
              className={`form-control ${fieldErrors.asunto ? 'is-invalid' : ''}`}
              id="asunto"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value.slice(0, 150))}
              maxLength={150}
              required
            />
            {fieldErrors.asunto?.map((msg, i) => (
              <div className="invalid-feedback" key={i}>
                {msg}
              </div>
            ))}
            <div className="form-text">{asunto.length}/150 caracteres</div>
          </div>

          <div className="mb-3">
            <label htmlFor="descripcion" className="form-label">
              Descripción
            </label>
            <textarea
              className={`form-control ${fieldErrors.descripcion ? 'is-invalid' : ''}`}
              id="descripcion"
              rows={5}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value.slice(0, 1000))}
              minLength={30}
              maxLength={1000}
              required
            />
            {fieldErrors.descripcion?.map((msg, i) => (
              <div className="invalid-feedback" key={i}>
                {msg}
              </div>
            ))}
            <div className="form-text">{descripcion.length}/1000 caracteres (mínimo 30)</div>
          </div>

          <div className="mb-4">
            <label htmlFor="adjuntos" className="form-label">
              Adjuntos (opcional)
            </label>
            <input
              type="file"
              className="form-control"
              id="adjuntos"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              disabled={adjuntos.length >= MAX_FILES}
            />
            <div className="form-text">
              PDF, JPG o PNG. Máximo {MAX_FILES} archivos, {MAX_FILE_SIZE_MB}MB por archivo.
            </div>
            {adjuntos.length > 0 && (
              <ul className="list-group mt-2">
                {adjuntos.map((file, i) => (
                  <li
                    className="list-group-item d-flex justify-content-between align-items-center"
                    key={i}
                  >
                    <span>
                      {file.name}{' '}
                      <small className="text-muted">
                        ({(file.size / 1024).toFixed(0)} KB)
                      </small>
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeFile(i)}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Enviando...' : 'Enviar solicitud'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => router.push('/dashboard')}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </DashboardLayout>
  )
}
