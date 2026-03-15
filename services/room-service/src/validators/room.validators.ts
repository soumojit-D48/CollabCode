import { z } from 'zod'

const languages = [
  'javascript', 'typescript', 'python',
  'go', 'rust', 'java', 'cpp', 'c',
] as const

export const createRoomSchema = z.object({
  name:     z.string().min(3).max(50),
  language: z.enum(languages).default('javascript'),
  isPublic: z.boolean().default(false),
})

export const updateRoomSchema = z.object({
  name:     z.string().min(3).max(50).optional(),
  language: z.enum(languages).optional(),
  isPublic: z.boolean().optional(),
})

export type CreateRoomInput = z.infer<typeof createRoomSchema>
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>