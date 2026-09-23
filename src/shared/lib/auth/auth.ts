// lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/shared/db";
import * as schema from "@/shared/db/schema";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
   database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
         ...schema,
      },
   }),
   emailAndPassword: {
      enabled: true,
   },
   account: {
      accountLinking: {
         enabled: true,
         trustedProviders: ["google, github"],
      },
   },
   baseURL: process.env.BETTER_AUTH_URL,
   socialProviders: {
      github: {
         clientId: process.env.GITHUB_CLIENT_ID as string,
         clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
         overrideUserInfoOnSignIn: true,

         mapProfileToUser: (profile) => ({
            image: profile.avatar_url,
            name: profile.name ?? profile.login,
         }),
      },

      google: {
         clientId: process.env.GOOGLE_CLIENT_ID as string,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
         overrideUserInfoOnSignIn: true,
         prompt: "select_account",
         isTrustedProvider: true,
         mapProfileToUser: (profile) => ({
            image: profile.picture,
            name: profile.name,
         }),
      },
   },
   user: {
      changeEmail: {
         enabled: true,
      },
   },

   plugins: [nextCookies()],
});
