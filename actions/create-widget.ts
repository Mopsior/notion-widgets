'use server' 

import { checkSession } from "@/lib/auth"
import { headers } from "next/headers"

export const createWidget = async () => {
    const session = await checkSession({
        headers: await headers()
    })

    if (!session) {
        const error = new Error('User not authenticated');
        error.name = 'auth/not-authenticated'
        throw error;
    }

    
}