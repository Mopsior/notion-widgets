'use server' 

import { WidgetElement } from "@/config/available-widgets"
import db from "@/db"
import { counter } from "@/db/schema"
import { checkSession } from "@/lib/auth"
import { catchError } from "@/lib/catch-error"
import { headers } from "next/headers"
import { widgetsList } from "@/config/available-widgets"
import { isSingleEmoji } from "@/utils/is-single-emoji"

export const createWidget = async (
    type: WidgetElement["code"],
    data: any
) => {
    console.log(type, data)
    const session = await checkSession({
        headers: await headers()
    })

    if (!session) {
        const error = new Error('User not authenticated')
        error.name = 'auth/not-authenticated'
        throw error
    }

    const validCodes = widgetsList.map(widget => widget.code)
    if (!validCodes.includes(type)) {
        const error = new Error('Wrong request. This component don\'t exists')
        error.name = 'create-widget/template-dont-exists'
        throw error
    }

    switch (type) {
        case 'goal-counter':
            return createCounterWidget(session, data)
        default:
            const error = new Error('Widget type not supported')
            error.name = 'create-widget/type-not-supported'
            throw error
    }
}

const createCounterWidget = async (
    session: { user: { id: string }},
    data: { title: string, goal: number, icon?: string }
) => {
    if (!data.title || !data.goal) {
        const error = new Error('Title and goal are required')
        error.name = 'create-widget/validation-error'
        throw error
    }
    if (typeof data.goal !== 'number' || data.goal <= 0) {
        const error = new Error('Goal must be a positive number')
        error.name = 'create-widget/validation-error'
        throw error
    }
    if (data.icon && typeof data.icon !== 'string') {
        const error = new Error('Icon must be a string')
        error.name = 'create-widget/validation-error'
        throw error
    }
    
    const iconValue =
        typeof data.icon === "string" && isSingleEmoji(data.icon)
            ? data.icon
            : data.title.slice(0, 2).toUpperCase();

    const [error] = await catchError(db.insert(counter).values({
        id: crypto.randomUUID(),
        title: data.title,
        userId: session.user.id,
        goal: data.goal,
        icon: iconValue,
    }))

    if (error) {
        const error = new Error('Error while creating widget in DB')
        error.name = 'create-widget/error-db'
        throw error
    }

    return { success: true }
}