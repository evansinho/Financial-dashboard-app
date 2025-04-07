import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      httpOptions: {
        timeout: 10000
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const user = await res.json();
          if (res.ok && user) {
            return user;
          }
          throw new Error("Invalid credentials");
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error("Authorization failed");
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = token.user as { name?: string | null; email?: string | null; image?: string | null } | undefined;
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.user = user;

        // Persist Google login data to the database
        if (account?.provider === "google") {
          try {
            const { name, email } = user;
            if (!name || !email) {
              throw new Error("Missing required user fields for registration");
            }

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name,
                email,
                provider: account.provider,
              }),
            });
          } catch (error) {
            console.error("Error saving Google user to database:", error);
          }
        }
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback triggered:", { url, baseUrl });
      // Redirect to /dashboard if the user is authenticated
      if (url === `${baseUrl}/login` && baseUrl) {
        return `${baseUrl}/dashboard`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  pages: {
    signIn: "/login",
  },
});
