import { QueryParams, PaginatedResponse } from './types/api'
import { db } from './db'

export const DEFAULT_PAGE_SIZE = 10

export function parsePaginationParams(params: QueryParams) {
  return {
    page: Math.max(1, Number(params.page) || 1),
    pageSize: Math.min(100, Math.max(1, Number(params.pageSize) || DEFAULT_PAGE_SIZE))
  }
}

export function parseSortParams(params: QueryParams, allowedFields: string[]) {
  const sortBy = params.sortBy && allowedFields.includes(params.sortBy)
    ? params.sortBy
    : 'createdAt'
  
  const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc'
  
  return { sortBy, sortOrder }
}

export async function createPaginatedResponse<T>(
  data: T[],
  total: number,
  params: QueryParams
): Promise<PaginatedResponse<T>> {
  const { page, pageSize } = parsePaginationParams(params)
  
  return {
    data,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  }
}
