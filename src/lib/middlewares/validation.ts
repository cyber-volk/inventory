import { NextResponse } from 'next/server'
import { z } from 'zod'
import { AppError } from '../utils/errors'

export async function validateRequest<T>(
  request: Request,
  schema: z.Schema<T>
): Promise<T> {
  try {
    const json = await request.json()
    return schema.parse(json)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw AppError.badRequest('Validation failed', 'VALIDATION_ERROR', error.errors)
    }
    throw error
  }
}
