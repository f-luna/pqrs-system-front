const estadoConfig: Record<string, { clase: string; label: string }> = {
  recibida: { clase: 'bg-secondary', label: 'Recibida' },
  en_gestion: { clase: 'bg-primary', label: 'En gestión' },
  resuelta: { clase: 'bg-success', label: 'Resuelta' },
  cerrada: { clase: 'bg-dark', label: 'Cerrada' },
}

export default function EstadoBadge({ estado }: { estado: string }) {
  const config = estadoConfig[estado] || { clase: 'bg-secondary', label: estado }
  return <span className={`badge ${config.clase}`}>{config.label}</span>
}
