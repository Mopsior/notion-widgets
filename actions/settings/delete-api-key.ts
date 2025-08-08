'use server'

import db from "@/db"
import { apikey } from "@/db/schema"
import { auth } from "@/lib/auth"
import { catchError } from "@/lib/catch-error"
import { throwError } from "@/utils/throw-error"
import { headers } from "next/headers"
import { eq, and } from "drizzle-orm";

export const deleteAPIKey = async (id: string) => {
    const [sessionError, session] = await catchError(auth.api.getSession({
        headers: await headers()
    }))

    if (sessionError) throw sessionError
    if (!session) return throwError('Not logged in', 'auth/not-logged-in')

    const [fetchKeysError, fetchKeys] = await catchError(db
        .select()
        .from(apikey)
        .where(and(eq(apikey.id, id), eq(apikey.userId, session.user.id)))
    )
    if (fetchKeysError) return throwError("Failed to fetch API keys", 'db/fetch-api-keys-error')
    if (!fetchKeys || fetchKeys.length === 0) return throwError("API key not found", 'db/api-key-not-found')

    const [deleteError] = await catchError(db
        .delete(apikey)
        .where(and(eq(apikey.id, id), eq(apikey.userId, session.user.id)))
    )

    if (deleteError) return throwError("Failed to delete API key. Data may be corrupted", 'db/delete-api-key-error')
    
    return { success: true }
}