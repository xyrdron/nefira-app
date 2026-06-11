import { Link } from "@heroui/react";
import { Navbar } from "@/components/nav/landnav";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow overflow-hidden">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://xyrdron.com"
          title="Xyrdron homepage"
        >
          <span className="text-default-600">Nefira Indev |</span>
          <p className="text-primary">Xyrdron</p>
          <span className="text-default-600">and Mizook HQ 2025</span>
        </Link>
      </footer>
    </div>
  );
}
