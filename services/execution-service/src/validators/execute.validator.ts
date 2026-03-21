import { z } from 'zod'

export const executeSchema = z.object({
  code:     z.string().min(1, 'Code is required').max(100_000, 'Code too long'),
  language: z.enum([
    'javascript',
    'typescript',
    'python',
    'go',
    'rust',
    'java',
    'cpp',
    'c',
  ]),
  stdin: z.string().max(10_000).optional().default(''),
})

export type ExecuteInput = z.infer<typeof executeSchema>