'use server'

import db from "@/db"
import { apikey } from "@/db/schema"
import { auth } from "@/lib/auth"
import { catchError } from "@/lib/catch-error"
import { throwError } from "@/utils/throw-error"
import { headers } from "next/headers"
import { eq, and } from "drizzle-orm";

export const verifyAPIKey = async (token: string) => {
    if (!token || token.trim().length === 0) return throwError('Invalid API key', 'auth/invalid-api-key')

    const [sessionError, session] = await catchError(auth.api.getSession({
        headers: await headers()
    }))
    if (sessionError) throw sessionError
    if (!session) return throwError('Not logged in', 'auth/not-logged-in')

    const [fetchError, fetchData] = await catchError(auth.api.verifyApiKey({
        body: {
            key: token,
        },
    }))
    if (fetchError) throw fetchError
    if (!fetchData || !fetchData.key || !fetchData.key.id) return throwError("API key not found", 'auth/api-key-not-found')

    const [fetchKeysError, fetchKeys] = await catchError(db
        .select()
        .from(apikey)
        .where(and(eq(apikey.userId, session.user.id), eq(apikey.id, fetchData.key?.id)))
    )
    if (fetchKeysError) return throwError("Failed to fetch API keys", 'db/fetch-api-keys-error')
    if (!fetchKeys || fetchKeys.length === 0) return throwError("API key not found", 'auth/api-key-not-found-2')
    
    if (fetchKeys[0].userId !== session.user.id) return throwError("API key not found", 'auth/api-key-not-found-3')

    return fetchData
}