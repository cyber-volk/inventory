import { NextRequest } from 'next/server'
import { Cache } from '../cache'
import { AppError } from '../utils/errors'

const WINDOW_MS = 60000 // 1 minute
const MAX_REQUESTS = 100

export async function rateLimit(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'
  const key = `ratelimit:${ip}`
  
  const cache = Cache.getInstance()
  const current = await cache.get<number>(key) || 0
  
  if (current >= MAX_REQUESTS) {
    throw AppError.tooManyRequests()
  }
  
  await cache.set(key, current + 1, WINDOW_MS / 1000)
}
