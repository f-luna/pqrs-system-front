import Link from 'next/link'
import { Pqrs } from '@/src/types'
import EstadoBadge from './EstadoBadge'
import CategoriaBadge from './CategoriaBadge'

export default function PqrsCard({ pqrs }: { pqrs: Pqrs }) {
  return (
    <tr>
      <td className="fw-bold">{pqrs.numero_radicado}</td>
      <td>
        <CategoriaBadge categoria={pqrs.categoria} />
      </td>
      <td>{pqrs.asunto}</td>
      <td>
        <EstadoBadge estado={pqrs.estado} />
      </td>
      <td>{pqrs.fecha_limite}</td>
      <td>
        <Link href={`/dashboard/pqrs/${pqrs.id}`} className="btn btn-sm btn-outline-primary">
          Ver detalle
        </Link>
      </td>
    </tr>
  )
}
