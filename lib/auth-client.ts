// @ts-ignore
import { createAuthClient } from "better-auth/react";
// @ts-ignore
import { usernameClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [usernameClient()],
  sessionOptions: {
    refetchOnWindowFocus: false,
  },
});

export const { signIn, signOut, signUp, useSession } = authClient;
