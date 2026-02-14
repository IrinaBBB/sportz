import { Router } from 'express'
import { eq, desc } from 'drizzle-orm'
import { db } from '../db/db.js'
import { commentary } from '../db/schema.js'
import {
    createCommentarySchema,
    listCommentaryQuerySchema,
} from '../validation/commentary.js'
import { matchIdParamSchema } from '../validation/matches.js'

export const commentaryRouter = Router({ mergeParams: true })

commentaryRouter.get('/', async (req, res) => {
    const paramParsed = matchIdParamSchema.safeParse(req.params)
    if (!paramParsed.success) {
        return res.status(400).json({
            error: 'Invalid match ID',
            details: paramParsed.error.issues,
        })
    }

    const queryParsed = listCommentaryQuerySchema.safeParse(req.query)
    if (!queryParsed.success) {
        return res.status(400).json({
            error: 'Invalid query parameters',
            details: queryParsed.error.issues,
        })
    }

    const { id: matchId } = paramParsed.data
    const { limit = 100 } = queryParsed.data

    try {
        const results = await db
            .select()
            .from(commentary)
            .where(eq(commentary.matchId, matchId))
            .orderBy(desc(commentary.createdAt))
            .limit(limit)

        res.status(200).json({ data: results })
    } catch (error) {
        console.error('Error fetching commentary:', error)
        res.status(500).json({
            error: 'Failed to fetch commentary',
            details: error.message,
        })
    }
})

commentaryRouter.post('/', async (req, res) => {
    const paramParsed = matchIdParamSchema.safeParse(req.params)
    if (!paramParsed.success) {
        return res.status(400).json({
            error: 'Invalid match ID',
            details: paramParsed.error.issues,
        })
    }

    const bodyParsed = createCommentarySchema.safeParse(req.body)
    if (!bodyParsed.success) {
        return res.status(400).json({
            error: 'Invalid commentary data',
            details: bodyParsed.error.issues,
        })
    }

    try {
        const [result] = await db
            .insert(commentary)
            .values({
                ...bodyParsed.data,
                matchId: paramParsed.data.id,
            })
            .returning()

        res.status(201).json({ data: result })
    } catch (error) {
        console.error('Error creating commentary:', error)
        res.status(500).json({
            error: 'Failed to create commentary',
            details: error.message,
        })
    }
})

