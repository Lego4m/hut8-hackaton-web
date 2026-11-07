import type { Me } from './queries'

/** Where to go after login: the ?voltar= page (same-site paths only), else a sensible home. */
export function afterLoginPath(user: Me, voltar: string | null) {
  if (voltar && voltar.startsWith('/') && !voltar.startsWith('//')) return voltar
  return user.role === 'admin' ? '/admin' : '/doces'
}
