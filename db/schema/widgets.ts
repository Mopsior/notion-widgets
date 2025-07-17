import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const counter = pgTable("widget_counter", {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    // IDEA:
    // type: 'interval' | 'day' | 'month' 
    // interval format: interval-<amount>-<unit>-<hours>-<minutes>
    // day format: day-<amount>
    // ex: interval-1-day-0-0 means everyday at 00:00
    // ex: interval-1-week-0-0 means every week on the same day at 00:00
    // ex. day-1 means every monday
    // ex. day-2 means every tuesday
    // ex. month means every 1st day of the month at 00:00

    // ACTUAL:
    // day of week to restart
    timeOfLife: text('time_of_life').notNull(),
    title: text('title').notNull().$default(() => 'Counter'),
    icon: text('icon').notNull(),
    createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
})

export const counter_fields = pgTable("widget_counter_fields", {
    id: text('id').primaryKey(),
    counterId: text('counter_id').notNull().references(() => counter.id, { onDelete: 'cascade' }),
    name: text('name'), // !! can be null ex. only one field
    goal: integer('goal').notNull(),
    value: integer('value').notNull().$defaultFn(() => 0)
})

export const counter_history = pgTable("widget_counter_histories", {
    id: text('id').primaryKey(),
    fieldId: text('field_id').notNull().references(() => counter_fields.id, { onDelete: 'cascade' }),
    value: integer('value').notNull(),
    createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
})