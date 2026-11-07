import { Link, useNavigate } from 'react-router'
import { useCreateUser } from '../../features/admin/queries'
import { UserForm } from '../../features/admin/UserForm'
import { errorMessage } from '../../lib/api'

export function NewUserPage() {
  const navigate = useNavigate()
  const createUser = useCreateUser()

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <Link to="/admin/usuarios" className="text-sm text-brand-600 hover:underline">← Voltar para usuários</Link>
      <h1 className="text-2xl font-bold">Novo usuário</h1>
      <UserForm
        submitLabel="Criar usuário"
        pending={createUser.isPending}
        error={createUser.isError ? errorMessage(createUser.error) : null}
        onSubmit={(input) => createUser.mutate(input, { onSuccess: (user) => navigate(`/admin/usuarios/${user.id}`) })}
        onCancel={() => navigate('/admin/usuarios')}
      />
    </div>
  )
}
