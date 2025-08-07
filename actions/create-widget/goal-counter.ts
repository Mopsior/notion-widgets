'use server'

import { auth, checkSession } from "@/lib/auth"
import { headers } from "next/headers"
import type { formSchema } from "@/components/app-setup/forms/goal-counter/goal-counter"
import z from "zod"
import { isSingleEmoji } from "@/utils/is-single-emoji"
import { catchError } from "@/lib/catch-error"
import db from "@/db"
import { counter, counter_fields } from "@/db/schema/widgets"

export const createWidget = async (
    data: z.infer<typeof formSchema>
) => {
    const session = await checkSession({
        headers: await headers()
    })

    if (!session) {
        const error = new Error('User not authenticated')
        error.name = 'auth/not-authenticated'
        throw error
    }

    if (!data.title || !data.timeOfLife || !data.fields) {
        const error = new Error('Name, ToL and Fields are required')
        error.name = 'create-widget/validation-error'
        throw error
    }
    if (typeof data.title !== 'string' || data.title.trim().length < 1) {
        const error = new Error('Name must be a non-empty string')
        error.name = 'create-widget/validation-error'
        throw error
    }
    if (data.title.length > 20) {
        const error = new Error('Title must be less than 20 characters')
        error.name = 'create-widget/validation-error'
        throw error
    }
    if (data.icon && typeof data.icon !== 'string') {
        const error = new Error('Icon must be a non-empty string or not be provided')
        error.name = 'create-widget/validation-error'
        throw error
    }
    if (!data.timeOfLife || !['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(data.timeOfLife)) {
        const error = new Error('Time of life must be one of the days of the week')
        error.name = 'create-widget/validation-error'
        throw error
    }
    if (!Array.isArray(data.fields) || data.fields.length < 1 || data.fields.length > 4) {
        const error = new Error('Fields must be an array with 1 to 4 items')
        error.name = 'create-widget/validation-error'
        throw error
    }
    for (const field of data.fields) {
        if (field.name && (typeof field.name !== 'string' || field.name.trim().length < 1)) {
            const error = new Error('Field name must be a non-empty string')
            error.name = 'create-widget/validation-error'
            throw error
        }
        if (field.name && field.name.length > 30) {
            const error = new Error('Field name must be less than 24 characters')
            error.name = 'create-widget/validation-error'
            throw error
        }
        if (typeof field.goal !== 'number' || field.goal <= 0) {
            const error = new Error('Field goal must be a positive number')
            error.name = 'create-widget/validation-error'
            throw error
        }
        if (field.goal > 32000) {
            const error = new Error('Field goal is too high')
            error.name = 'create-widget/validation-error'
            throw error
        }
    }

    const iconValue =
        typeof data.icon === "string" && isSingleEmoji(data.icon)
            ? data.icon
            : data.title.slice(0, 2).toUpperCase()

    const mainId = crypto.randomUUID()

    const [mainError] = await catchError(db.insert(counter).values({
        id: mainId,
        userId: session.user.id,
        timeOfLife: data.timeOfLife,
        title: data.title,
        icon: iconValue,
    }))
    if (mainError) {
        const error = new Error('Error while creating widget in DB')
        error.name = 'create-widget/error-db'
        throw error
    }

    const fields = data.fields.map((field, index) => ({
        id: crypto.randomUUID(),
        counterId: mainId,
        userId: session.user.id,
        name: field.name || null,
        goal: field.goal,
        value: 0,
        order: index,
        createdAt: new Date(),
        updatedAt: new Date(),
    }))

    const [fieldsError] = await catchError(db.insert(counter_fields).values(fields))

    if (fieldsError) {
        const error = new Error('Error while creating widget fields in DB')
        error.name = 'create-widget/error-fields-db'
        throw error
    }

    const [apiKeyError, apiKeyResponse] = await catchError(auth.api.createApiKey({
        body: {
            name: `Goal Counter Widget`,
            userId: session.user.id,
        }
    }))
    if (apiKeyError) {
        const error = new Error('Error while creating API key for widget')
        error.name = 'create-widget/error-api-key'
        console.error('API Key Error:', apiKeyError)
        throw error
    }

    console.log('Created widget with API key:', apiKeyResponse)

    return { success: true, apiKeyResponse }
}