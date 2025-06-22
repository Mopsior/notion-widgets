
import db from "@/db";
import * as schema from "@/db/schema";
import { betterAuth } from "better-auth";
import { apiKey } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }
  },
  plugins: [
    apiKey(),
    nextCookies() // Must be last
  ]
});

export const checkSession = auth.api.getSession