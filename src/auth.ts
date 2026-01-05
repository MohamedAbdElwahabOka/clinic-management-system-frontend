// src/auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 }, // 7 days

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;


        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000/api";
          console.log("Using backend URL:", backendUrl);
          const res = await fetch(`${backendUrl}/auth/login`, {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" },
          });

          const responseData = await res.json();

          if (!res.ok || !responseData.success) {
            console.error("Login failed:", responseData);
            return null;
          }

          const { auth, data } = responseData;
          if (auth?.token && data?.fhirUser) {
            const fhirUser = data.fhirUser;

            // Extract email
            const emailObj = fhirUser.telecom?.find((t: any) => t.system === "email");
            const email = emailObj?.value;

            // Extract name (prefer English or first available)
            const nameObj = fhirUser.name?.find((n: any) => n._language === "en") || fhirUser.name?.[0];
            const name = nameObj?.text || "Unknown";

            // Extract role
            const roleObj = fhirUser.extension?.find((e: any) => e.url === "http://example.org/fhir/StructureDefinition/user-role");
            const role = roleObj?.valueString || "user";

            return {
              id: fhirUser.id,
              name: name,
              email: email,
              role: role,
              accessToken: auth.token,
            };
          }

          return null;

        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.accessToken = user.accessToken
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.accessToken = token.accessToken as string
      }
      return session
    }
  }
})