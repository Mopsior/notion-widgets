'use server'

import db from "@/db"
import { counter, counter_fields } from "@/db/schema"
import { auth } from "@/lib/auth"
import { catchError } from "@/lib/catch-error"
import { throwError } from "@/utils/throw-error"
import { eq, and } from "drizzle-orm";

export const getWidgetData = async ( widgetId: string, apiToken: string ) => {
    if (!widgetId) return throwError("Widget ID is required", 'auth/no-widget-id')
    if (!apiToken) return throwError("API Token is required", 'auth/no-api-token')

    const { valid, error, key } = await auth.api.verifyApiKey({
        body: {
            key: apiToken,
        },
    })

    if (error && error.code === 'RATE_LIMITED') return throwError("Rate limit exceeded", 'auth/rate-limited')
    if (error) {console.error(error); return throwError("Failed to verify API key", 'auth/verification-failed')}
    if (!valid || !key) return throwError("Invalid API key", 'auth/invalid-api-key')
    if (!key.userId) return throwError("User ID not found in API key", 'auth/no-user-id')

    const [widgetRecordError, widgetRecord] = await catchError(db
        .select()
        .from(counter)
        .where(and(eq(counter.id, widgetId), eq(counter.userId, key.userId)))
        .limit(1)
    )

    if (widgetRecordError) {
        return throwError("Failed to fetch widget record", 'db/fetch-widget-record-error')
    }

    if (!widgetRecord || widgetRecord.length === 0) {
        return throwError("Widget not found or access denied", 'db/widget-not-found')
    }

    const [fieldsError, fields] = await catchError(db
        .select()
        .from(counter_fields)
        .where(eq(counter_fields.counterId, widgetId))
        .orderBy(counter_fields.order, counter_fields.createdAt)
    )

    if (fieldsError) {
        return throwError("Failed to fetch widget fields", 'db/fetch-widget-fields-error')
    }

    if (fields.length === 0) {
        return throwError("No fields found for widget", 'db/no-fields-found')
    }

    return { widgetRecord, fields }
}