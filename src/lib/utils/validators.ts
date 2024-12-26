import { z } from 'zod';

export const itemSchema = z.object({
  name: z.string().min(2).max(100),
  sku: z.string().min(3).max(50),
  barcode: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().cuid(),
  supplierId: z.string().cuid(),
  currentStock: z.number().min(0),
  minimumStock: z.number().min(0),
  maximumStock: z.number().optional(),
  reorderPoint: z.number().optional(),
  locationId: z.string().cuid().optional(),
  unitPrice: z.number().min(0),
  costPrice: z.number().min(0),
  modelCompatibility: z.array(z.string()),
  weight: z.number().optional(),
  dimensions: z.object({
    length: z.number(),
    width: z.number(),
    height: z.number()
  }).optional(),
  tags: z.array(z.string()),
  metadata: z.record(z.any()).optional()
})
