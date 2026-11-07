import axios from 'axios'
import { clearToken, getToken } from './authToken'
import { queryClient } from './queryClient'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// An expired or revoked token logs the user out everywhere in the app.
api.interceptors.response.use(undefined, (error) => {
  if (axios.isAxiosError(error) && error.response?.status === 401 && getToken()) {
    clearToken()
    queryClient.setQueryData(['me'], null)
  }
  return Promise.reject(error)
})

/** Shape returned by ApplicationController#render_api_response */
export type ApiResponse<T> = {
  data: T
  pagination?: Pagination
}

export type Pagination = {
  page: number
  pages: number
  count: number
  limit: number
  previous?: number
  next?: number
}

/** Turns an API error into a message the admin can read. */
export function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string; messages?: string[] } | undefined
    if (data?.messages?.length) return data.messages.join('. ')
    if (data?.error) return data.error
    if (!error.response) return 'Não foi possível conectar ao servidor.'
  }
  return 'Algo deu errado. Tente novamente.'
}
