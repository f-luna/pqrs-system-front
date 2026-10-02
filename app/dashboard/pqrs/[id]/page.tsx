'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/src/components/DashboardLayout'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import AlertMessage from '@/src/components/AlertMessage'
import EstadoBadge from '@/src/components/EstadoBadge'
import CategoriaBadge from '@/src/components/CategoriaBadge'
import { pqrsService } from '@/src/services/pqrsService'
import { Pqrs } from '@/src/types'

const estadoProgreso: Record<string, number> = {
  recibida: 25,
  en_gestion: 50,
  resuelta: 75,
  cerrada: 100,
}

const progresoColor: Record<string, string> = {
  recibida: 'bg-secondary',
  en_gestion: 'bg-primary',
  resuelta: 'bg-success',
  cerrada: 'bg-dark',
}

export default function PqrsDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [pqrs, setPqrs] = useState<Pqrs | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    pqrsService
      .getById(Number(id))
      .then(setPqrs)
      .catch(() => setError('No se pudo cargar el detalle de la solicitud.'))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <DashboardLayout>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <AlertMessage type="danger" message={error} />
      ) : pqrs ? (
        <>
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h4 className="fw-bold mb-1">{pqrs.numero_radicado}</h4>
                  <div className="d-flex gap-2 mb-2">
                    <CategoriaBadge categoria={pqrs.categoria} />
                    <EstadoBadge estado={pqrs.estado} />
                  </div>
                </div>
              </div>
              <p className="mb-1">
                <strong>Asunto:</strong> {pqrs.asunto}
              </p>
              <p className="mb-1">
                <strong>Fecha de registro:</strong> {pqrs.created_at}
              </p>
              <p className="mb-3">
                <strong>Fecha límite:</strong> {pqrs.fecha_limite}
              </p>
              <div className="mb-2">
                <small className="text-muted">Progreso</small>
                <div className="progress" style={{ height: '10px' }}>
                  <div
                    className={`progress-bar ${progresoColor[pqrs.estado]}`}
                    style={{ width: `${estadoProgreso[pqrs.estado]}%` }}
                  />
                </div>
                <div className="d-flex justify-content-between mt-1">
                  <small className="text-muted">Recibida</small>
                  <small className="text-muted">En gestión</small>
                  <small className="text-muted">Resuelta</small>
                  <small className="text-muted">Cerrada</small>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Descripción</h5>
              <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                {pqrs.descripcion}
              </p>
            </div>
          </div>

          {pqrs.adjuntos.length > 0 && (
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Adjuntos</h5>
                <ul className="list-group list-group-flush">
                  {pqrs.adjuntos.map((adjunto) => (
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center"
                      key={adjunto.id}
                    >
                      <span>
                        {adjunto.nombre_original}{' '}
                        <small className="text-muted">({adjunto.tamanio_kb} KB)</small>
                      </span>
                      <a
                        href={adjunto.ruta}
                        className="btn btn-sm btn-outline-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Descargar
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {pqrs.respuesta_final &&
            (pqrs.estado === 'resuelta' || pqrs.estado === 'cerrada') && (
              <div className="card mb-4 shadow-sm border-success">
                <div className="card-body">
                  <h5 className="fw-bold mb-3 text-success">Respuesta de la empresa</h5>
                  <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                    {pqrs.respuesta_final}
                  </p>
                </div>
              </div>
            )}

          {pqrs.historial.length > 0 && (
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Historial de estados</h5>
                <div className="position-relative">
                  {pqrs.historial.map((item, index) => (
                    <div className="d-flex mb-3" key={item.id}>
                      <div className="d-flex flex-column align-items-center me-3">
                        <div
                          className="rounded-circle bg-primary"
                          style={{ width: '12px', height: '12px' }}
                        />
                        {index < pqrs.historial.length - 1 && (
                          <div
                            className="bg-secondary"
                            style={{ width: '2px', flexGrow: 1 }}
                          />
                        )}
                      </div>
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <EstadoBadge estado={item.estado_nuevo} />
                          <small className="text-muted">{item.created_at}</small>
                        </div>
                        {item.comentario && (
                          <p className="mb-0 text-muted small">{item.comentario}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Link href="/dashboard" className="btn btn-secondary">
            Volver a mis solicitudes
          </Link>
        </>
      ) : null}
    </DashboardLayout>
  )
}
