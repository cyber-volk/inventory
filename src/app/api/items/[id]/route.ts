import { NextRequest } from 'next/server';
import { db } from '../../../lib/db';
import { rateLimit } from '../../../lib/middlewares/rate-limit';
import { AppError } from '../../../lib/utils/errors';

export async function GET(request: NextRequest) {
  try {
    await rateLimit(request)
    
    const item = await db.item.findUnique({
      where: { id: request.nextUrl.searchParams.get('id') },
      include: {
        category: true,
        supplier: true,
        location: true,
        images: true,
        stockMovements: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    
    if (!item) {
      throw AppError.notFound('Item not found')
    }
    
    return new Response(JSON.stringify(item), { status: 200 });
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return new Response(JSON.stringify({ error: error.message }), { status: error.statusCode });
    }
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), { status: 500 });
  }
}
