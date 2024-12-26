export type PaginatedResponse<T> = {
  data: T[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export type SortOrder = 'asc' | 'desc'

export interface QueryParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: SortOrder
  search?: string
  filter?: Record<string, any>
}
