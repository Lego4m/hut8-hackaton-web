import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router'
import { Field } from '../components/Field'
import { inputClass, primaryButtonClass } from '../components/formStyles'
import { useLogin, useMe } from '../features/auth/queries'
import { afterLoginPath } from '../features/auth/redirect'
import { errorMessage } from '../lib/api'

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const voltar = searchParams.get('voltar')
  const { data: me } = useMe()
  const login = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (me && !login.isSuccess) return <Navigate to={afterLoginPath(me, voltar)} replace />

  const registerLink = voltar ? `/cadastro?voltar=${encodeURIComponent(voltar)}` : '/cadastro'

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Entrar</h1>
        <p className="text-sm text-muted">Bem-vindo(a) de volta à Doces da Lurdes!</p>
      </div>

      <form
        className="flex flex-col gap-4 rounded-2xl border border-brand-100 bg-white p-6"
        onSubmit={(event) => {
          event.preventDefault()
          login.mutate({ email, password }, { onSuccess: ({ user }) => navigate(afterLoginPath(user, voltar), { replace: true }) })
        }}
      >
        <Field label="E-mail">
          <input required type="email" autoComplete="email" autoFocus className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Senha">
          <input required type="password" autoComplete="current-password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {login.isError && <p role="alert" className="text-sm text-brand-700">{errorMessage(login.error)}</p>}
        <button type="submit" disabled={login.isPending} className={primaryButtonClass}>
          {login.isPending ? 'Entrando…' : 'Entrar'}
        </button>
      </form>

      <p className="text-center text-sm text-muted">
        Ainda não tem conta? <Link to={registerLink} className="font-medium text-brand-600 hover:underline">Criar conta</Link>
      </p>
    </div>
  )
}
