'use server'

import { auth } from "@/lib/auth"
import { catchError } from "@/lib/catch-error"
import { throwError } from "@/utils/throw-error"
import { headers } from "next/headers"

export const createAPIKey = async () => {
    const [sessionError, session] = await catchError(auth.api.getSession({
        headers: await headers()
    }))
    if (sessionError) throw sessionError
    if (!session) return throwError('Not logged in', 'auth/not-logged-in')

    const [createKeyError, createKey] = await catchError(auth.api.createApiKey({
        body: {
            userId: session.user.id
        }
    }))

    if (createKeyError) throw createKeyError
    if (!createKey) return throwError('Failed to create API key', 'auth/create-api-key-error')

    return {
        success: true,
        key: createKey.key,
        id: createKey.id,
    }
}