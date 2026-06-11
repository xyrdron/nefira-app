import {
  Button,
  Kbd,
  Link,
  Input,
  Alert,
} from "@heroui/react";
import NextLink from "next/link";
import clsx from "clsx";
import { headers } from "next/headers";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
} from "@/components/icons";
import { auth } from "@/lib/auth";
import { MobileMenu } from "./mobile-menu"; // Adjust import path accordingly

export const Navbar = async () => {
  const searchInput = (
    <Input
      aria-label="Search"
      classnames={{
        inputWrapper: "bg-default-100 w-full lg:w-[240px]",
        input: "text-sm",
      }}
      endcontent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelplacement="outside"
      placeholder="Search..."
      startcontent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  // Authentication Context Fetch
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg navbar-container">
      {/* Dev Warning Banner */}
      <Alert status="warning">
        <Alert.Indicator />
        <Alert.Title className="text-sm font-medium">Notice to web traffic</Alert.Title>
          <Alert.Description className="text-sm">
            Nefira is still in development and is very unstable, you require an invite code to access the site.
          </Alert.Description>

      </Alert>

      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 gap-4">
        {/* Left Side: Brand Logo and Desktop Nav Links */}
        <div className="flex items-center gap-6">
          <NextLink className="flex justify-start items-center gap-1 flex-shrink-0" href="/">
            <p className="font-bold text-inherit tracking-wide">NEFIRA (INDEV)</p>
          </NextLink>

          {/* Desktop Core Links */}
          <ul className="hidden md:flex items-center gap-4">
            {siteConfig.navItems.map((item) => (
              <li key={item.href}>
                <NextLink
                  className={clsx(
                    "text-sm text-foreground hover:text-primary transition-colors duration-200 data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side: Search, Social Links, Auth Status */}
        <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
          <div className="w-full max-w-[240px] hidden lg:block">
            {searchInput}
          </div>

          <ul className="flex items-center gap-2">
            <li>
              <Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
                <TwitterIcon className="text-default-500 hover:text-foreground transition-colors" />
              </Link>
            </li>
            <li>
              <Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
                <DiscordIcon className="text-default-500 hover:text-foreground transition-colors" />
              </Link>
            </li>
            <li>
              <Link isExternal aria-label="Github" href={siteConfig.links.github}>
                <GithubIcon className="text-default-500 hover:text-foreground transition-colors" />
              </Link>
            </li>
            <li>
              <ThemeSwitch />
            </li>
          </ul>

          {/* Authentication Action Button Wrapper Fix */}
          <div className="flex items-center">
            {session ? (
              <NextLink href="/app" passHref legacyBehavior>
                <Button
                  className="text-sm font-normal text-default-600 bg-default-100 hover:bg-default-200"
                  startcontent={<HeartFilledIcon className="text-danger animate-pulse" />}
                >
                  Welcome {session.user.displayUsername}
                </Button>
              </NextLink>
            ) : (
              <NextLink href="/app/login" passHref legacyBehavior>
                <Button
                  className="text-sm font-medium text-white bg-primary"
                >
                  Sign In
                </Button>
              </NextLink>
            )}
          </div>
        </div>

        {/* Client-Side Mobile Dropdown Handling */}
        <MobileMenu searchInput={searchInput} />
      </header>
    </nav>
  );
};