import { useState, type ChangeEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router'
import { Field } from '../components/Field'
import { inputClass, primaryButtonClass } from '../components/formStyles'
import { useMe, useRegister } from '../features/auth/queries'
import { afterLoginPath } from '../features/auth/redirect'
import { errorMessage } from '../lib/api'

export function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const voltar = searchParams.get('voltar')
  const { data: me } = useMe()
  const register = useRegister()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmation: '' })
  const [mismatch, setMismatch] = useState(false)

  if (me && !register.isSuccess) return <Navigate to={afterLoginPath(me, voltar)} replace />

  const set = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [key]: event.target.value }))

  const loginLink = voltar ? `/entrar?voltar=${encodeURIComponent(voltar)}` : '/entrar'

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Criar conta</h1>
        <p className="text-sm text-muted">Cadastre-se para fazer seus pedidos.</p>
      </div>

      <form
        className="flex flex-col gap-4 rounded-2xl border border-brand-100 bg-white p-6"
        onSubmit={(event) => {
          event.preventDefault()
          if (form.password !== form.confirmation) {
            setMismatch(true)
            return
          }
          setMismatch(false)
          register.mutate(
            { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() || null, password: form.password },
            { onSuccess: ({ user }) => navigate(afterLoginPath(user, voltar), { replace: true }) },
          )
        }}
      >
        <Field label="Nome completo">
          <input required autoComplete="name" autoFocus className={inputClass} value={form.name} onChange={set('name')} />
        </Field>
        <Field label="E-mail">
          <input required type="email" autoComplete="email" className={inputClass} value={form.email} onChange={set('email')} />
        </Field>
        <Field label="Telefone (opcional)">
          <input type="tel" autoComplete="tel" placeholder="(11) 90000-0000" className={inputClass} value={form.phone} onChange={set('phone')} />
        </Field>
        <Field label="Senha" hint="Mínimo de 6 caracteres.">
          <input required type="password" minLength={6} autoComplete="new-password" className={inputClass} value={form.password} onChange={set('password')} />
        </Field>
        <Field label="Confirmar senha">
          <input required type="password" autoComplete="new-password" className={inputClass} value={form.confirmation} onChange={set('confirmation')} />
        </Field>
        {mismatch && <p role="alert" className="text-sm text-brand-700">As senhas não conferem.</p>}
        {register.isError && <p role="alert" className="text-sm text-brand-700">{errorMessage(register.error)}</p>}
        <button type="submit" disabled={register.isPending} className={primaryButtonClass}>
          {register.isPending ? 'Criando conta…' : 'Criar conta'}
        </button>
      </form>

      <p className="text-center text-sm text-muted">
        Já tem conta? <Link to={loginLink} className="font-medium text-brand-600 hover:underline">Entrar</Link>
      </p>
    </div>
  )
}
