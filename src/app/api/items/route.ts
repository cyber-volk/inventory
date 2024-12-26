import { NextRequest } from 'next/server'
import { db } from '../../../lib/db'
import { cache } from '../../../lib/cache'
import { validateRequest } from '../../../lib/middlewares/validation'
import { rateLimit } from '../../../lib/middlewares/rate-limit'
import { uploadFile } from '../../../lib/utils/upload'
import { itemSchema } from '../../../lib/utils/validators'
import { AppError } from '../../../lib/utils/errors'

export async function GET(request: NextRequest) {
  try {
    await rateLimit(request)
    
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    
    const { page, pageSize } = parsePaginationParams(params)
    const { sortBy, sortOrder } = parseSortParams(params, [
      'name', 'sku', 'currentStock', 'createdAt'
    ])
    
    const where = {
      ...(params.search && {
        OR: [
          { name: { contains: params.search, mode: 'insensitive' } },
          { sku: { contains: params.search, mode: 'insensitive' } },
          { barcode: { contains: params.search, mode: 'insensitive' } }
        ]
      }),
      ...(params.category && { categoryId: params.category }),
      ...(params.supplier && { supplierId: params.supplier }),
      ...(params.status && { status: params.status })
    }
    
    // Try cache first
    const cacheKey = `items:${JSON.stringify({ params, where, page, pageSize, sortBy, sortOrder })}`
    const cached = await cache.get(cacheKey)
    if (cached) {
      return Response.json(cached)
    }
    
    const [items, total] = await Promise.all([
      db.item.findMany({
        where,
        include: {
          category: true,
          supplier: true,
          location: true,
          images: true
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder }
      }),
      db.item.count({ where })
    ])
    
    const response = await createPaginatedResponse(items, total, { page, pageSize })
    
    // Cache for 5 minutes
    await cache.set(cacheKey, response, 300)
    
    return Response.json(response)
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return Response.json({ error: error.message }, { status: error.statusCode })
    }
    return Response.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await rateLimit(request)
    
    const formData = await request.formData()
    const itemData = await validateRequest(
      new Request(request.url, {
        method: 'POST',
        body: formData.get('data')
      }),
      itemSchema
    )
    
    const images = formData.getAll('images') as File[]
    
    const item = await db.$transaction(async (tx) => {
      // Create item
      const item = await tx.item.create({
        data: itemData,
        include: {
          category: true,
          supplier: true,
          location: true
        }
      })
      
      // Handle images
      if (images.length > 0) {
        const imageUrls = await Promise.all(
          images.map(async (image, index) => {
            const buffer = Buffer.from(await image.arrayBuffer())
            const url = await uploadFile(buffer, image.type, `items/${item.id}`)
            
            return tx.itemImage.create({
              data: {
                itemId: item.id,
                url,
                isPrimary: index === 0,
                order: index
              }
            })
          })
        )
        
        item.images = imageUrls
      }
      
      return item
    })
    
    // Invalidate cache
    await cache.delete('items:*')
    
    return Response.json(item)
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return Response.json({ error: error.message }, { status: error.statusCode })
    }
    return Response.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
