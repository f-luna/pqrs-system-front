'use client'

import Navbar from '@/src/components/Navbar'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Navbar />

      <section
        className="text-white text-center d-flex align-items-center"
        style={{ backgroundColor: '#1a1a2e', minHeight: '80vh', paddingTop: '80px' }}
      >
        <div className="container">
          <h1 className="display-4 fw-bold mb-4">
            ¿Tienes una Petición, Queja, Reclamo o Sugerencia?
          </h1>
          <p className="lead mb-4" style={{ maxWidth: '700px', margin: '0 auto' }}>
            Estamos aquí para escucharte. Registra tu solicitud y te responderemos en
            máximo 15 días hábiles.
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Link href="/register" className="btn btn-primary btn-lg">
              Registrarme ahora
            </Link>
            <Link href="/login" className="btn btn-outline-light btn-lg">
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 text-center border-0 shadow-sm">
                <div className="card-body">
                  <div className="fs-1 mb-3">📋</div>
                  <h5 className="card-title fw-bold">¿Qué es una PQRS?</h5>
                  <p className="card-text text-muted">
                    Son los mecanismos que tienes como consumidor para comunicarte con
                    nosotros: <strong>Peticiones</strong> de información,{' '}
                    <strong>Quejas</strong> sobre el servicio, <strong>Reclamos</strong>{' '}
                    por productos o servicios, y <strong>Sugerencias</strong> para mejorar.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 text-center border-0 shadow-sm">
                <div className="card-body">
                  <div className="fs-1 mb-3">⏱️</div>
                  <h5 className="card-title fw-bold">¿Cuánto tiempo tarda la respuesta?</h5>
                  <p className="card-text text-muted">
                    Por ley (Ley 1480 de 2011) tienes derecho a recibir respuesta en
                    máximo 15 días hábiles desde el registro de tu solicitud.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 text-center border-0 shadow-sm">
                <div className="card-body">
                  <div className="fs-1 mb-3">🔒</div>
                  <h5 className="card-title fw-bold">Tus datos están protegidos</h5>
                  <p className="card-text text-muted">
                    Tu información personal es tratada conforme a la Ley 1581 de 2012 de
                    protección de datos personales de Colombia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">¿Cómo funciona?</h2>
          <div className="row g-4">
            {[
              { paso: '1', titulo: 'Crea tu cuenta', desc: 'Regístrate con tu correo electrónico en menos de un minuto.' },
              { paso: '2', titulo: 'Registra tu solicitud', desc: 'Describe tu petición, queja, reclamo o sugerencia con los detalles necesarios.' },
              { paso: '3', titulo: 'Haz seguimiento en línea', desc: 'Consulta el estado de tu solicitud en cualquier momento desde tu panel.' },
              { paso: '4', titulo: 'Recibe respuesta por correo', desc: 'Te notificaremos cuando tu solicitud haya sido resuelta.' },
            ].map((item) => (
              <div className="col-md-3 text-center" key={item.paso}>
                <div
                  className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}
                >
                  {item.paso}
                </div>
                <h5 className="fw-bold">{item.titulo}</h5>
                <p className="text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-dark text-white text-center py-4">
        <div className="container">
          <p className="mb-1 fw-bold">Sistema PQRS — {new Date().getFullYear()}</p>
          <p className="mb-0 small text-white-50">
            En cumplimiento de la Ley 1480 de 2011 — Estatuto del Consumidor
          </p>
        </div>
      </footer>
    </>
  )
}
