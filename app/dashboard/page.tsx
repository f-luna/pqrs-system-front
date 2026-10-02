'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/src/components/DashboardLayout'
import PqrsCard from '@/src/components/PqrsCard'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import AlertMessage from '@/src/components/AlertMessage'
import { pqrsService } from '@/src/services/pqrsService'
import { Pqrs } from '@/src/types'

export default function DashboardPage() {
  const [pqrsList, setPqrsList] = useState<Pqrs[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    pqrsService
      .getAll()
      .then(setPqrsList)
      .catch(() => setError('No se pudieron cargar las solicitudes.'))
      .finally(() => setLoading(false))
  }, [])

  const total = pqrsList.length
  const recibidas = pqrsList.filter((p) => p.estado === 'recibida').length
  const enGestion = pqrsList.filter((p) => p.estado === 'en_gestion').length
  const resueltasCerradas = pqrsList.filter(
    (p) => p.estado === 'resuelta' || p.estado === 'cerrada'
  ).length

  return (
    <DashboardLayout>
      <h4 className="fw-bold mb-4">Mis solicitudes ({total})</h4>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 bg-light text-center">
            <div className="card-body">
              <h3 className="fw-bold">{total}</h3>
              <small className="text-muted">Total</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-light text-center">
            <div className="card-body">
              <h3 className="fw-bold text-secondary">{recibidas}</h3>
              <small className="text-muted">Recibidas</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-light text-center">
            <div className="card-body">
              <h3 className="fw-bold text-primary">{enGestion}</h3>
              <small className="text-muted">En gestión</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-light text-center">
            <div className="card-body">
              <h3 className="fw-bold text-success">{resueltasCerradas}</h3>
              <small className="text-muted">Resueltas / Cerradas</small>
            </div>
          </div>
        </div>
      </div>

      {error && <AlertMessage type="danger" message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : pqrsList.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted fs-5">Aún no has registrado ninguna solicitud.</p>
          <Link href="/dashboard/nueva-pqrs" className="btn btn-primary">
            Registrar mi primera PQRS
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Radicado</th>
                <th>Categoría</th>
                <th>Asunto</th>
                <th>Estado</th>
                <th>Fecha límite</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {pqrsList.map((pqrs) => (
                <PqrsCard key={pqrs.id} pqrs={pqrs} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}
