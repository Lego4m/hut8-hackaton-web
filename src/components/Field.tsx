import type { ReactNode } from 'react'

export function Field({ label, hint, children, className = '' }: {
  label: string
  hint?: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={`flex flex-col gap-1 text-sm ${className}`}>
      <span className="font-medium">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  )
}
