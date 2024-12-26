import { NextRequest } from 'next/server';
import { db } from '../../../lib/db';
import { cache } from '../../../lib/cache';
import { validateRequest } from '../../../lib/middlewares/validation';
import { rateLimit } from '../../../lib/middlewares/rate-limit';
import { AppError } from '../../../lib/utils/errors';
import { z } from 'zod';

const stockMovementSchema = z.object({
  type: z.enum(['PURCHASE', 'SALE', 'ADJUSTMENT', 'TRANSFER', 'RETURN', 'WRITE_OFF']),
  quantity: z.number().min(1),
  itemId: z.string(),
  reference: z.string().optional(),
  notes: z.string().optional(),
  unitPrice: z.number().min(0),
  metadata: z.record(z.any()).optional()
})

export async function POST(request: NextRequest) {
  try {
    await rateLimit(request)
    
    const data = await validateRequest(request, stockMovementSchema)
    
    const result = await db.$transaction(async (tx) => {
      // Get current item
      const item = await tx.item.findUnique({
        where: { id: data.itemId }
      })
      
      if (!item) {
        throw AppError.notFound('Item not found')
      }
      
      // Check stock levels for outgoing movements
      if (
        ['SALE', 'TRANSFER', 'WRITE_OFF'].includes(data.type) && 
        item.currentStock < data.quantity
      ) {
        throw AppError.badRequest('Insufficient stock')
      }
      
      // Create stock movement
      const movement = await tx.stockMovement.create({
        data: {
          ...data,
          totalPrice: data.quantity * data.unitPrice,
          status: 'COMPLETED'
        },
        include: {
          item: true
        }
      })
      
      // Update item stock
      const updatedItem = await tx.item.update({
        where: { id: data.itemId },
        data: {
          currentStock: {
            [['PURCHASE', 'RETURN'].includes(data.type) ? 'increment' : 'decrement']: 
              data.quantity
          }
        }
      })
      
      // Create notification if stock is low
      if (updatedItem.currentStock <= updatedItem.minimumStock) {
        await tx.notification.create({
          data: {
            type: 'LOW_STOCK',
            title: 'Low Stock Alert',
            message: `Item ${item.name} (${item.sku}) has reached low stock level`,
            metadata: {
              itemId: item.id,
              currentStock: updatedItem.currentStock,
              minimumStock: updatedItem.minimumStock
            }
          }
        })
      }
      
      return { movement, updatedItem }
    })
    
    // Invalidate relevant caches
    await Promise.all([
      cache.delete(`items:${data.itemId}`),
      cache.delete('items:*'),
      cache.delete('stock-movements:*')
    ])
    
    return new Response(JSON.stringify(result));
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return new Response(JSON.stringify({ error: error.message }), { status: error.statusCode });
    }
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), { status: 500 });
  }
}
