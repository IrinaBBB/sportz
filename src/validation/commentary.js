import { z } from 'zod'

/**
 * Schema for validating list commentary query parameters.
 */
export const listCommentaryQuerySchema = z.object({
    limit: z.coerce.number().positive().max(100).optional(),
})

/**
 * Schema for validating create commentary payload.
 */
export const createCommentarySchema = z.object({
    minute: z.number().int().nonnegative(),
    sequence: z.number().int(),
    period: z.number().int().min(1).max(2),
    eventType: z.string(),
    actor: z.string().optional(),
    team: z.string().optional(),
    message: z.string().min(1),
    metadata: z.record(z.string(), z.any()).optional(),
    tags: z.array(z.string()).optional(),
})
