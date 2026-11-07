import { useState } from 'react'
import { Card } from '../../components/Card'
import { Field } from '../../components/Field'
import { inputClass, primaryButtonClass, secondaryButtonClass } from '../../components/formStyles'
import { roleLabels } from './labels'
import type { UserInput, UserRole } from './types'

const STATES = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']

/** Create/edit form for a user. Empty optional fields are sent as null. */
export function UserForm({ initial, hasPassword = false, submitLabel, pending, error, onSubmit, onCancel }: {
  initial?: Partial<UserInput>
  hasPassword?: boolean
  submitLabel: string
  pending: boolean
  error?: string | null
  onSubmit: (input: UserInput) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    email: initial?.email ?? '',
    phone: initial?.phone ?? '',
    role: initial?.role ?? ('customer' as UserRole),
    address: initial?.address ?? '',
    city: initial?.city ?? '',
    state: initial?.state ?? '',
    password: '',
  })

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          role: form.role,
          address: form.address.trim() || null,
          city: form.city.trim() || null,
          state: form.state || null,
          ...(form.password ? { password: form.password } : {}),
        })
      }}
    >
      <Card title="Dados pessoais">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome *">
            <input required autoFocus className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} />
          </Field>
          <Field label="E-mail *">
            <input required type="email" className={inputClass} value={form.email} onChange={(e) => set('email', e.target.value)} />
          </Field>
          <Field label="Telefone">
            <input type="tel" placeholder="(11) 90000-0000" className={inputClass} value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          </Field>
          <Field label="Perfil" hint="Administradores têm acesso ao painel.">
            <select className={inputClass} value={form.role} onChange={(e) => set('role', e.target.value as UserRole)}>
              <option value="customer">{roleLabels.customer}</option>
              <option value="admin">{roleLabels.admin}</option>
            </select>
          </Field>
        </div>
      </Card>

      <Card title="Acesso">
        <Field
          label={hasPassword ? 'Nova senha' : 'Senha'}
          hint={hasPassword
            ? 'Deixe vazio para manter a senha atual.'
            : 'Opcional. Sem senha, o usuário não consegue entrar no site.'}
          className="sm:max-w-sm"
        >
          <input type="password" minLength={6} autoComplete="new-password" className={inputClass} value={form.password} onChange={(e) => set('password', e.target.value)} />
        </Field>
      </Card>

      <Card title="Endereço">
        <div className="grid gap-4 sm:grid-cols-6">
          <Field label="Endereço" className="sm:col-span-6">
            <input placeholder="Rua, número, complemento" className={inputClass} value={form.address} onChange={(e) => set('address', e.target.value)} />
          </Field>
          <Field label="Cidade" className="sm:col-span-4">
            <input className={inputClass} value={form.city} onChange={(e) => set('city', e.target.value)} />
          </Field>
          <Field label="Estado" className="sm:col-span-2">
            <select className={inputClass} value={form.state} onChange={(e) => set('state', e.target.value)}>
              <option value="">—</option>
              {STATES.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
            </select>
          </Field>
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? 'Salvando…' : submitLabel}
        </button>
        <button type="button" onClick={onCancel} className={secondaryButtonClass}>Cancelar</button>
        {error && <span className="text-sm text-brand-700">{error}</span>}
      </div>
    </form>
  )
}
