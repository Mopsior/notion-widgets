'use server'

import db from "@/db"
import { apikey } from "@/db/schema"
import { auth } from "@/lib/auth"
import { catchError } from "@/lib/catch-error"
import { throwError } from "@/utils/throw-error"
import { headers } from "next/headers"
import { eq, desc, sql } from "drizzle-orm";

export const fetchAPIKeys = async () => {
    const [sessionError, session] = await catchError(auth.api.getSession({
        headers: await headers()
    }))
    if (sessionError) throw sessionError
    if (!session) return throwError('Not logged in', 'auth/not-logged-in')

    const [fetchKeysError, fetchKeys] = await catchError(db
        .select()
        .from(apikey)
        .where(eq(apikey.userId, session.user.id))
        .orderBy(sql`${desc(apikey.lastRequest)} NULLS LAST`)
    )
    if (fetchKeysError) return throwError("Failed to fetch API keys", 'db/fetch-api-keys-error')

    const keys = fetchKeys.map(key => ({
        id: key.id,
        start: key.start,
        createdAt: key.createdAt,
        lastRequest: key.lastRequest
    }))

    return {
        success: true,
        keys: keys
    }
}