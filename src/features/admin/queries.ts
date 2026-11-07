import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type ApiResponse } from '../../lib/api'
import type { AdminCandy, AdminUser, NewOrderInput, Order, OrderStatus, Overview, StoreSettings, UserInput } from './types'

export type UsersParams = { page: number; q?: string; role?: string }
export type OrdersParams = { page: number; q?: string; status?: string; user_id?: string | number }

export const adminKeys = {
  all: ['admin'] as const,
  overview: (days: number) => [...adminKeys.all, 'overview', days] as const,
  users: (params: UsersParams) => [...adminKeys.all, 'users', 'list', params] as const,
  user: (id: string) => [...adminKeys.all, 'users', 'detail', id] as const,
  orders: (params: OrdersParams) => [...adminKeys.all, 'orders', 'list', params] as const,
  order: (id: string) => [...adminKeys.all, 'orders', 'detail', id] as const,
  settings: () => [...adminKeys.all, 'settings'] as const,
  candies: () => [...adminKeys.all, 'candies'] as const,
}

export function useOverview(days: number) {
  return useQuery({
    queryKey: adminKeys.overview(days),
    queryFn: async () => (await api.get<ApiResponse<Overview>>('/admin/overview', { params: { days } })).data.data,
    placeholderData: keepPreviousData,
  })
}

export function useAdminUsers(params: UsersParams, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: async () => (await api.get<ApiResponse<AdminUser[]>>('/admin/users', { params })).data,
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  })
}

export function useAdminUser(id: string | undefined) {
  return useQuery({
    queryKey: adminKeys.user(id ?? ''),
    queryFn: async () => (await api.get<ApiResponse<AdminUser>>(`/admin/users/${id}`)).data.data,
    enabled: !!id,
  })
}

export function useAdminOrders(params: OrdersParams, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: adminKeys.orders(params),
    queryFn: async () => (await api.get<ApiResponse<Order[]>>('/admin/orders', { params })).data,
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  })
}

export function useAdminOrder(id: string | undefined) {
  return useQuery({
    queryKey: adminKeys.order(id ?? ''),
    queryFn: async () => (await api.get<ApiResponse<Order>>(`/admin/orders/${id}`)).data.data,
    enabled: !!id,
  })
}

type OrderChanges = Partial<{ status: OrderStatus; notes: string; shipping_cents: number; discount_cents: number }>

export function useUpdateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, changes }: { id: number; changes: OrderChanges }) =>
      (await api.patch<ApiResponse<Order>>(`/admin/orders/${id}`, { order: changes })).data.data,
    onSuccess: (order) => {
      queryClient.setQueryData(adminKeys.order(String(order.id)), order)
      // Lists, totals and user stats may all change with an order.
      queryClient.invalidateQueries({ queryKey: adminKeys.all })
    },
  })
}

export function useSettings() {
  return useQuery({
    queryKey: adminKeys.settings(),
    queryFn: async () => (await api.get<ApiResponse<StoreSettings>>('/admin/settings')).data.data,
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (changes: Partial<StoreSettings>) =>
      (await api.patch<ApiResponse<StoreSettings>>('/admin/settings', { settings: changes })).data.data,
    onSuccess: (settings) => queryClient.setQueryData(adminKeys.settings(), settings),
  })
}

export function useAdminCandies() {
  return useQuery({
    queryKey: adminKeys.candies(),
    queryFn: async () => (await api.get<ApiResponse<AdminCandy[]>>('/admin/candies')).data.data,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: NewOrderInput) =>
      (await api.post<ApiResponse<Order>>('/admin/orders', { order: input })).data.data,
    onSuccess: (order) => {
      // Totals, user stats and candy stock all change with a new order.
      queryClient.invalidateQueries({ queryKey: adminKeys.all })
      queryClient.invalidateQueries({ queryKey: ['candies'] })
      queryClient.setQueryData(adminKeys.order(String(order.id)), order)
    },
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UserInput) =>
      (await api.post<ApiResponse<AdminUser>>('/admin/users', { user: input })).data.data,
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: [...adminKeys.all, 'users'] })
      queryClient.setQueryData(adminKeys.user(String(user.id)), user)
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, changes }: { id: number; changes: Partial<UserInput> }) =>
      (await api.patch<ApiResponse<AdminUser>>(`/admin/users/${id}`, { user: changes })).data.data,
    onSuccess: (user) => {
      queryClient.setQueryData(adminKeys.user(String(user.id)), user)
      // Names also show up inside order lists.
      queryClient.invalidateQueries({ queryKey: adminKeys.all })
    },
  })
}
