// import { auth } from "@/lib/auth";

// export const incrementField = async (
//     token: string,
//     fieldId: string
// ) => {
//     if (!token || !fieldId) {
//         throw new Error("Token and field ID are required").message = 'Token and field ID are required';
//     }

//     const { valid, error, key } = await auth.api.verifyApiKey({
//         body: {
//             key: token,
//         },
//     })
//     if (error) {
//         throw new Error(error.message || "Failed to verify API key").message = error.message || 'Failed to verify API key';
//     }
//     if (!valid || !key) {
//         throw new Error("Invalid API key").message = 'Invalid API key';
//     }

//     // verifying is this user widget
// }

'use server'

import db from "@/db"
import { counter_fields } from "@/db/schema"
import { auth } from "@/lib/auth"
import { catchError } from "@/lib/catch-error"
import { throwError } from "@/utils/throw-error"
import { eq, and } from "drizzle-orm"

export const incrementField = async ({
    fieldId,
    apiToken
}: {
    fieldId: string,
    apiToken: string
}) => {
    if (!apiToken || !fieldId) return throwError('Not provided expected arguments. You need to generate new widget URL. You shouldn\'t see this...', 'auth/validation')
    
    const { valid, error, key } = await auth.api.verifyApiKey({
        body: {
            key: apiToken,
        },
    })

    if (error && error.code === 'RATE_LIMITED') return throwError("Rate limit exceeded", 'auth/rate-limited')
    if (error) {console.error(error); return throwError("Failed to verify API key", 'auth/verification-failed')}
    if (!valid || !key) return throwError("Invalid API key", 'auth/invalid-api-key')
    if (!key.userId) return throwError("User ID not found in API key", 'auth/no-user-id')

    const [fieldError, field] = await catchError(db
        .select()
        .from(counter_fields)
        .where(and(eq(counter_fields.id, fieldId), eq(counter_fields.userId, key.userId)))
        .limit(1)
    )

    if (fieldError) {
        return throwError("Failed to fetch field record", 'db/fetch-field-record-error')
    }

    if (!field || field.length === 0 || field[0].userId !== key.userId) {
        return throwError("Field not found or access denied", 'db/field-not-found')
    }

    if (field[0].value >= field[0].goal) {
        return throwError("Field value already reached the goal", 'db/field-value-reached-goal')
    }

    const [incrementError] = await catchError(db
        .update(counter_fields)
        .set({ value: field[0].value + 1 })
        .where(and(eq(counter_fields.id, fieldId), eq(counter_fields.userId, key.userId)))
    )

    if (incrementError) {
        return throwError("Failed to increment field value", 'db/increment-field-value-error')
    }

    return { success: true }
}