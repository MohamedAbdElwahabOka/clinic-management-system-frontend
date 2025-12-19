// src/auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 }, // ساعة مثلاً
  
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        // --- هنا الداتا الوهمية بذكاء ---
        // 1. يوزر الدكتور (Admin)
        if (email === "doctor@clinica.com" && password === "123") {
            return { 
                id: "1", 
                name: "Dr. Ahmed", 
                email: "doctor@clinica.com", 
                role: "admin" // <--- ركز هنا
            }
        }

        // 2. يوزر الاستقبال (Reception)
        if (email === "reception@clinica.com" && password === "123") {
            return { 
                id: "2", 
                name: "Sarah Reception", 
                email: "reception@clinica.com", 
                role: "reception" // <--- ركز هنا
            }
        }
        
        return null
      },
    }),
  ],
  callbacks: {
    // بناخد الرول من اليوزر نحطها في التوكن
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role // حفظ الرول في التوكن
      }
      return token
    },
    // بناخد الرول من التوكن نحطها في السيشن (عشان الفرونت يشوفها)
    async session({ session, token }) {
      if (session.user) {
         session.user.id = token.id as string
         session.user.role = token.role as string // تمرير الرول
      }
      return session
    }
  }
})