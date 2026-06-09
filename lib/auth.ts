// @ts-ignore
import { betterAuth } from "better-auth";
// @ts-ignore
import { prismaAdapter } from "better-auth/adapters/prisma";
// @ts-ignore
import { PrismaClient } from "@prisma/client";
// @ts-ignore
import { nextCookies } from "better-auth/next-js";
// @ts-ignore
import leoProfanity from "leo-profanity";
// @ts-ignore
import { admin } from "better-auth/plugins";
// @ts-ignore
import { username } from "better-auth/plugins";
// @ts-ignore
import { haveIBeenPwned } from "better-auth/plugins";
// @ts-ignore
import { captcha } from "better-auth/plugins";

leoProfanity.loadDictionary("en");

const bannedUsernames = [
  "admin",
  "administrator",
  "root",
  "system",
  "moderator",
  "staff",
  "support",
  "nefira",
  "gamer123",
];

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    disableSignUp:
      process.env.NEXT_PUBLIC_AUTH_DISABLED === "true" ? true : false,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 1 * 60, // Cache duration in seconds
    },
  },
  plugins: [
    captcha({
      provider: "cloudflare-turnstile",
      secretKey: process.env.TURNSTILE_SECRET_KEY!,
    }),
    haveIBeenPwned({
      customPasswordCompromisedMessage:
        "Password has been found in a data breach. Please choose another one.",
    }),
    username({
      minUsernameLength: 3,
      maxUsernameLength: 32,
      usernameValidator: (username) => {
        const clean = username
          .normalize("NFKC") // standardize Unicode
          .replace(/[\u200B-\u200D\uFEFF]/g, "") // remove zero-width chars
          .trim()
          .toLowerCase();

        if (!clean) return false;
        const badWords = leoProfanity.list(); // returns array of words

        if (badWords.some((word) => clean.includes(word))) {
          return false;
        }
        const bannedRegex = new RegExp(bannedUsernames.join("|"), "i");

        if (bannedRegex.test(clean)) {
          return false;
        }

        return /^[a-zA-Z0-9_.-]+$/.test(clean);
      },
      usernameNormalization: (username) => {
        const clean = username
          .normalize("NFKC") // standardize Unicode
          .replace(/[\u200B-\u200D\uFEFF]/g, "") // remove zero-width chars
          .trim()
          .toLowerCase();

        return clean;
      },
      validationOrder: {
        username: "post-normalization",
        displayUsername: "post-normalization",
      },
    }),
    admin(),
    nextCookies(),
  ], // make sure nextCookies is the last plugin in the array (otherwise he used his boomerang too much and it will not work properly)
});
