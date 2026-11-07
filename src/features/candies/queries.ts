import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api, type ApiResponse } from '../../lib/api'
import type { Candy, CandyDetail } from './types'

export const candyKeys = {
  all: ['candies'] as const,
  list: (params: { page: number; category?: string }) => [...candyKeys.all, 'list', params] as const,
  detail: (id: string | number) => [...candyKeys.all, 'detail', String(id)] as const,
}

export function useCandies(params: { page: number; category?: string }) {
  return useQuery({
    queryKey: candyKeys.list(params),
    queryFn: async () => {
      console.log('heyo?')
      const { data } = await api.get<ApiResponse<Candy[]>>('/candies', { params })
      return data
    },
    // Keep showing the current page while the next one loads.
    placeholderData: keepPreviousData,
  })
}

export function useCandy(id: string | undefined) {
  return useQuery({
    queryKey: candyKeys.detail(id ?? ''),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<CandyDetail>>(`/candies/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}
