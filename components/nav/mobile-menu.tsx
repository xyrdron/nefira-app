// @/components/mobile-menu.tsx
"use client";

import { useState } from "react";
import { Link } from "@heroui/react";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";

export function MobileMenu({ searchInput }: { searchInput: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center gap-4">
      {/* Mobile Toggle Button */}
      <button
        className="text-default-500 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Fallback Static Icons alongside hamburger */}
      <div className="flex items-center gap-2">
        <Link aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
      </div>

      {/* Mobile Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 z-50 border-b border-separator bg-background/95 backdrop-blur-lg p-6 shadow-xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-full">{searchInput}</div>
          <ul className="flex flex-col gap-3 mt-2">
            {siteConfig.navMenuItems.map((item, index) => (
              <li key={`${item}-${index}`}>
                <Link
                  href={item || "#"}
                  className="w-full block py-1"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}