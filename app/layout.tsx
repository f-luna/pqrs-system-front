import type { Metadata } from 'next'
import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.css'
import { AuthProvider } from '@/src/context/AuthContext'

export const metadata: Metadata = {
  title: 'Sistema PQRS — SuperMercado Bogotá',
  description: 'Sistema de Peticiones, Quejas, Reclamos y Sugerencias',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
