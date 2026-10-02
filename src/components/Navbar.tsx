'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" href="/">
          Sistema PQRS
        </Link>
        <span className="navbar-text text-white d-none d-md-block mx-auto">
          SuperMercado Bogotá
        </span>
        <div className="d-flex gap-2">
          <Link href="/login" className="btn btn-outline-light btn-sm">
            Iniciar sesión
          </Link>
          <Link href="/register" className="btn btn-primary btn-sm">
            Registrarse
          </Link>
        </div>
      </div>
    </nav>
  )
}
