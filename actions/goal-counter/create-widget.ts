'use server'

import { auth, checkSession } from "@/lib/auth"
import { headers } from "next/headers"
import type { formSchema } from "@/components/app-setup/forms/goal-counter/goal-counter"
import z from "zod"
import { isSingleEmoji } from "@/utils/is-single-emoji"
import { catchError } from "@/lib/catch-error"
import db from "@/db"
import { counter, counter_fields } from "@/db/schema/widgets"
import { throwError } from "@/utils/throw-error"

export const createWidget = async (
    data: z.infer<typeof formSchema>
) => {
    const session = await checkSession({
        headers: await headers()
    })

    if (!session) return throwError('User not authenticated', 'auth/not-authenticated')

    if (!data.title || !data.timeOfLife || !data.fields) return throwError('Name, ToL and Fields are required', 'create-widget/validation-error')

    if (typeof data.title !== 'string' || data.title.trim().length < 1) return throwError('Name must be a non-empty string', 'create-widget/validation-error')

    if (data.title.length > 20) return throwError('Title must be less than 20 characters', 'create-widget/validation-error')

    if (data.icon && typeof data.icon !== 'string') return throwError('Icon must be a non-empty string or not be provided', 'create-widget/validation-error')

    if (
        !data.timeOfLife ||
        !['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(data.timeOfLife)
    ) return throwError('Time of life must be one of the days of the week', 'create-widget/validation-error')

    if (
        !Array.isArray(data.fields) ||
        data.fields.length < 1 ||
        data.fields.length > 4
    ) return throwError('Fields must be an array with 1 to 4 items', 'create-widget/validation-error')

    for (const field of data.fields) {
        if (field.name && (typeof field.name !== 'string' || field.name.trim().length < 1)) return throwError('Field name must be a non-empty string', 'create-widget/validation-error')

        if (field.name && field.name.length > 30) return throwError('Field name must be less than 30 characters', 'create-widget/validation-error')

        if (typeof field.goal !== 'number' || field.goal <= 0) return throwError('Field goal must be a positive number', 'create-widget/validation-error')

        if (field.goal > 32000) return throwError('Field goal is too high', 'create-widget/validation-error')
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
    if (mainError) return throwError('Error while creating widget in DB', 'create-widget/error-db')

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

    if (fieldsError) return throwError('Error while creating widget fields in DB', 'create-widget/error-fields-db')

    return {
        success: true,
        data: {
            id: mainId,
        }
    }
}