import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { api, type ApiResponse } from '../../lib/api'
import { clearToken, getToken, setToken } from '../../lib/authToken'

export type Me = {
  id: number
  name: string
  email: string
  phone: string | null
  role: 'customer' | 'admin'
}

type AuthResponse = ApiResponse<{ token: string; user: Me }>

export const meKey = ['me'] as const

/** The logged-in user, or null when nobody is logged in. */
export function useMe() {
  return useQuery({
    queryKey: meKey,
    queryFn: async (): Promise<Me | null> => {
      if (!getToken()) return null
      try {
        return (await api.get<ApiResponse<Me>>('/me')).data.data
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) return null
        throw error
      }
    },
    staleTime: 5 * 60_000,
  })
}

function useAuthMutation<Input>(request: (input: Input) => Promise<AuthResponse>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: Input) => (await request(input)).data,
    onSuccess: ({ token, user }) => {
      setToken(token)
      queryClient.setQueryData(meKey, user)
    },
  })
}

export function useLogin() {
  return useAuthMutation((input: { email: string; password: string }) =>
    api.post<AuthResponse>('/session', input).then((r) => r.data),
  )
}

export function useRegister() {
  return useAuthMutation((input: { name: string; email: string; phone: string | null; password: string }) =>
    api.post<AuthResponse>('/registration', { user: input }).then((r) => r.data),
  )
}

export function useLogout() {
  const queryClient = useQueryClient()

  return () => {
    clearToken()
    queryClient.setQueryData(meKey, null)
    // Admin data must not stay in memory after logging out.
    queryClient.removeQueries({ queryKey: ['admin'] })
  }
}
