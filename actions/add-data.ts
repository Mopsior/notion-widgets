'use server'
import db from "@/db"
import { usersTable } from "@/db/schema"

export const addData = async () => {
    await db.insert(usersTable).values({
        name: 'John Doe'
    })
}