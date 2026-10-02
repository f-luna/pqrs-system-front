interface AlertMessageProps {
  type: 'success' | 'danger' | 'warning' | 'info'
  message: string
}

export default function AlertMessage({ type, message }: AlertMessageProps) {
  return (
    <div className={`alert alert-${type}`} role="alert">
      {message}
    </div>
  )
}
