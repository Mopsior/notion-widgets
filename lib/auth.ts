import db from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { passkey } from "better-auth/plugins/passkey";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg'
    }),
    plugins: [
        passkey(),
        nextCookies() // Must be last
    ]
})