import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
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
