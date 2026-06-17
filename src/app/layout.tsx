// @ts-ignore: CSS module declaration missing in project
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import FirebasePerfProvider from "@/components/FirebaseProvider";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: 'https://nefira.xyz',
    siteName: siteConfig.name,
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <FirebasePerfProvider>
          <main>{children}</main>
          </FirebasePerfProvider>
        </Providers>
        <GoogleAnalytics gaId="G-8PGY0KW657" />
      </body>
    </html>
  );
}
