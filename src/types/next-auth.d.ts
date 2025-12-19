// src/types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string // ضفنا الرول هنا
    } & DefaultSession["user"]
  }

  interface User {
    role: string // ضفنا الرول هنا
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string // ضفنا الرول هنا
  }
}