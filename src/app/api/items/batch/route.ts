import { NextRequest } from 'next/server'
import { db } from '../../lib/db';
import { cache } from '../../lib/cache';
import { validateRequest } from '../../lib/middlewares/validation';
import { rateLimit } from '../../lib/middlewares/rate-limit';
import { AppError } from '../../lib/utils/errors';
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    await rateLimit(request)
    
    const { items, action } = await validateRequest(request, z.object({
      items: z.array(z.string()),
      action: z.enum(['delete', 'archive', 'restore'])
    }))
    
    let result
    
    await db.$transaction(async (tx) => {
      switch (action) {
        case 'delete':
          result = await tx.item.deleteMany({
            where: { id: { in: items } }
          })
          break
          
        case 'archive':
          result = await tx.item.updateMany({
            where: { id: { in: items } },
            data: { status: 'ARCHIVED' }
          })
          break
          
        case 'restore':
          result = await tx.item.updateMany({
            where: { id: { in: items } },
            data: { status: 'ACTIVE' }
          })
          break
      }
    })
    
    // Invalidate cache
    await cache.delete('items:*')
    
    return Response.json({ success: true, affected: result.count })
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return Response.json({ error: error.message }, { status: error.statusCode })
    }
    return Response.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
