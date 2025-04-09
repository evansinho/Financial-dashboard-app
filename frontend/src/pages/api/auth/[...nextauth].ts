import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface User {
    provider?: string;
    accessToken?: string;
  }
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      name?: string;
      email?: string;
      provider?: string;
    };
  }
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      httpOptions: {
        timeout: 10000,
      },
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

          const data = await res.json();
          console.log("Login API response:", data);

          if (res.ok && data.user) {
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              provider: data.user.provider,
              accessToken: data.token, // This will be available in the token callback
            };
          }
          throw new Error(data.message || "Invalid credentials");
        } catch (error) {
          console.error("Authorization error:", error instanceof Error ? error.message : error);
          throw new Error(error instanceof Error ? error.message : "Authorization failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          provider: user.provider,
        };
        token.accessToken = user.accessToken;
      }

      // Handle Google provider
      if (account?.provider === "google") {
        try {
          const { name, email } = token.user as { name?: string; email?: string } || {};
          if (!name || !email) {
            throw new Error("Missing required user fields for registration");
          }

          const registrationResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              email,
              provider: account.provider,
            }),
          });

          if (registrationResponse.ok) {
            const data = await registrationResponse.json();
            token.accessToken = data.token; // Store the backend token
          }
        } catch (error) {
          console.error("Error saving Google user to database:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.user = token.user as {
        id?: string;
        name?: string;
        email?: string;
        provider?: string;
      };
      session.accessToken = token.accessToken as string | undefined;
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url === `${baseUrl}/login` && baseUrl) {
        return `${baseUrl}/dashboard`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
});
