
import { z } from 'zod'

export const createFileSchema = z.object({
  name:    z.string().min(1).max(100),
  path:    z.string().min(1).max(500),
  content: z.string().default(''),
})

export const updateFileSchema = z.object({
  name:    z.string().min(1).max(100).optional(),
  path:    z.string().min(1).max(500).optional(),
  content: z.string().optional(),
})

export type CreateFileInput = z.infer<typeof createFileSchema>
export type UpdateFileInput = z.infer<typeof updateFileSchema>