import { Link, useNavigate, useParams } from 'react-router'
import { useAdminUser, useUpdateUser } from '../../features/admin/queries'
import { UserForm } from '../../features/admin/UserForm'
import { errorMessage } from '../../lib/api'

export function EditUserPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: user, isPending, isError } = useAdminUser(id)
  const updateUser = useUpdateUser()

  if (isPending) return <p className="text-muted">Carregando…</p>
  if (isError) return <p className="text-brand-700">Usuário não encontrado.</p>

  const backTo = `/admin/usuarios/${user.id}`

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <Link to={backTo} className="text-sm text-brand-600 hover:underline">← Voltar para {user.name}</Link>
      <h1 className="text-2xl font-bold">Editar usuário</h1>
      <UserForm
        initial={user}
        hasPassword={user.has_password}
        submitLabel="Salvar alterações"
        pending={updateUser.isPending}
        error={updateUser.isError ? errorMessage(updateUser.error) : null}
        onSubmit={(changes) => updateUser.mutate({ id: user.id, changes }, { onSuccess: () => navigate(backTo) })}
        onCancel={() => navigate(backTo)}
      />
    </div>
  )
}
