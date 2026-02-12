import { z } from 'zod'

// Helper to validate ISO 8601 UTC datetime strings (e.g., 2026-02-09T20:11:00Z or with milliseconds)
const isoUtcRegex =
    /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?Z$/
const isValidIsoUtc = (value) => {
    if (typeof value !== 'string' || !isoUtcRegex.test(value)) return false
    const d = new Date(value)
    return !Number.isNaN(d.getTime())
}

export const listMatchesQuerySchema = z.object({
    limit: z.coerce.number().int().positive().max(100).optional(),
})

export const MATCH_STATUS = {
    SCHEDULED: 'scheduled',
    LIVE: 'live',
    FINISHED: 'finished',
}

export const matchIdParamSchema = z.object({
    id: z.coerce.number().int().positive(),
})

export const createMatchSchema = z
    .object({
        sport: z.string().min(1),
        homeTeam: z.string().min(1),
        awayTeam: z.string().min(1),
        startTime: z.string().refine((v) => isValidIsoUtc(v), {
            message: 'startTime must be a valid ISO 8601 UTC string',
        }),
        endTime: z.string().refine((v) => isValidIsoUtc(v), {
            message: 'endTime must be a valid ISO 8601 UTC string',
        }),
        homeScore: z.coerce.number().int().nonnegative().optional(),
        awayScore: z.coerce.number().int().nonnegative().optional(),
    })
    .superRefine((val, ctx) => {
        // Only compare if both dates are valid strings
        if (isValidIsoUtc(val.startTime) && isValidIsoUtc(val.endTime)) {
            const start = new Date(val.startTime).getTime()
            const end = new Date(val.endTime).getTime()
            if (!(end > start)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'endTime must be after startTime',
                    path: ['endTime'],
                })
            }
        }
    })

export const updateScoreSchema = z.object({
    homeScore: z.coerce.number().int().nonnegative(),
    awayScore: z.coerce.number().int().nonnegative(),
})
