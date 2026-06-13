import { betterAuth } from "better-auth";

import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

import { nextCookies } from "better-auth/next-js";

import leoProfanity from "leo-profanity";

import { admin } from "better-auth/plugins";
import { username } from "better-auth/plugins";
import { haveIBeenPwned } from "better-auth/plugins";
import { captcha } from "better-auth/plugins";

import { stripe } from "@better-auth/stripe"
import Stripe from "stripe"

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-05-27.dahlia", // Latest API version as of Stripe SDK v22.0.0
})

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

// `prisma` is imported above

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
    stripe({
            stripeClient,
            stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
            createCustomerOnSignUp: true,
        }),
    admin(),
    nextCookies(),
  ], // make sure nextCookies is the last plugin in the array (otherwise he used his boomerang too much and it will not work properly)
});
