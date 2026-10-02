const categoriaConfig: Record<string, { clase: string; label: string }> = {
  peticion: { clase: 'bg-info text-dark', label: 'Petición' },
  queja: { clase: 'bg-warning text-dark', label: 'Queja' },
  reclamo: { clase: 'bg-danger', label: 'Reclamo' },
  sugerencia: { clase: 'bg-success', label: 'Sugerencia' },
}

export default function CategoriaBadge({ categoria }: { categoria: string }) {
  const config = categoriaConfig[categoria] || { clase: 'bg-secondary', label: categoria }
  return <span className={`badge ${config.clase}`}>{config.label}</span>
}
