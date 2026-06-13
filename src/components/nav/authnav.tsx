"use client";

export default function AppNavbar() {
  return (
    <nav className="fixed top-0 left-0 w-full h-12 bg-background/90 backdrop-blur-lg shadow-md z-50 flex items-center px-6">
      <div className="relative flex w-full items-center">
        <div className="absolute left-0 font-semibold text-foreground">
          Nefira
        </div>
      </div>
    </nav>
  );
}
