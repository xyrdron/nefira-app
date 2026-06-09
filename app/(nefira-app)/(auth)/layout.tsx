import { Metadata } from "next";
import { Card } from "@heroui/card";

import { siteConfig } from "@/config/site";
import Navbar from "@/components/nav/authnav";
import PreloadedBackground from "@/components/PreloadedBackground";

export const metadata: Metadata = {
  title: {
    default: "Sign into Nefira",
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container px-0 lg:px-0 w-full max-w-[1600px] mx-auto flex-grow overflow-hidden">
        <PreloadedBackground>
          <Card className="p-6 w-full max-w-md space-y-4 shadow-lg">
            {children}
          </Card>
        </PreloadedBackground>
      </main>
    </div>
  );
}
