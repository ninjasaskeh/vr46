import NextAuth from "next-auth"

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Return true if user is authenticated
      return !!auth
    },
  },
})