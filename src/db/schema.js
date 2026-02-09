import { sql } from 'drizzle-orm'
import {
    pgEnum,
    pgTable,
    serial,
    text,
    integer,
    smallint,
    timestamp,
    jsonb,
} from 'drizzle-orm/pg-core'

// Enums
export const matchStatusEnum = pgEnum('match_status', [
    'scheduled',
    'live',
    'finished',
])

// Tables
export const matches = pgTable('matches', {
    id: serial('id').primaryKey(),
    sport: text('sport').notNull(),
    homeTeam: text('home_team').notNull(),
    awayTeam: text('away_team').notNull(),
    status: matchStatusEnum('status').notNull().default('scheduled'),
    startTime: timestamp('start_time', { withTimezone: true }),
    endTime: timestamp('end_time', { withTimezone: true }),
    homeScore: integer('home_score').notNull().default(0),
    awayScore: integer('away_score').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
})

export const commentary = pgTable('commentary', {
    id: serial('id').primaryKey(),
    matchId: integer('match_id')
        .notNull()
        .references(() => matches.id, { onDelete: 'cascade' }),
    minute: integer('minute'),
    sequence: integer('sequence'),
    period: smallint('period'),
    eventType: text('event_type').notNull(),
    actor: text('actor'),
    team: text('team'),
    message: text('message').notNull(),
    metadata: jsonb('metadata')
        .notNull()
        .default(sql`'{}'::jsonb`),
    tags: text('tags')
        .array()
        .notNull()
        .default(sql`'{}'::text[]`),
    createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
})
