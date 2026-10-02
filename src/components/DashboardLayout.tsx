'use client'

import { ReactNode, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/src/context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  if (loading) return <LoadingSpinner />
  if (!isAuthenticated) return null

  const menuItems = [
    { href: '/dashboard', label: 'Mis PQRS', icon: '📋' },
    { href: '/dashboard/nueva-pqrs', label: 'Nueva PQRS', icon: '➕' },
  ]

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" href="/dashboard">
            Sistema PQRS
          </Link>
          <div className="d-flex align-items-center gap-3">
            <span className="text-white">{user?.name}</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      <div className="d-flex flex-grow-1">
        <nav className="bg-light border-end p-3" style={{ width: '240px', minHeight: 'calc(100vh - 56px)' }}>
          <ul className="nav flex-column gap-1">
            {menuItems.map((item) => (
              <li className="nav-item" key={item.href}>
                <Link
                  href={item.href}
                  className={`nav-link rounded ${
                    pathname === item.href ? 'active bg-primary text-white' : 'text-dark'
                  }`}
                >
                  {item.icon} {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex-grow-1 p-4 bg-white">{children}</main>
      </div>
    </div>
  )
}
