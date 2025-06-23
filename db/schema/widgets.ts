import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const counter = pgTable("widget_counter", {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    // format: <type>-*<amount>-*<unit>-*<hours>-*<minutes>
    // ex: interval-1-day-0-0 means everyday at 00:00
    // ex: interval-1-week-0-0 means every week on the same day at 00:00
    // timeOfLife: text('time_of_life').notNull(),
    goal: integer('goal'),
    title: text('title').notNull().$default(() => 'Counter'),
    createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
    icon: text('icon').notNull(),
})

export const counter_history = pgTable("widget_counter_history", {
    id: text('id').primaryKey(),
    counterId: text('counter_id').notNull().references(() => counter.id, { onDelete: 'cascade' }),
    value: integer('value').notNull(),
    createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
})