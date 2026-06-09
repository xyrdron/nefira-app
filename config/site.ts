export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Nefira",
  description: "The ultimate chatting app with no users",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    /*{
      label: "Docs",
      href: "/docs",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    },*/
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/app/logout",
    },
  ],
  links: {
    github: "https://github.com/xyrdron/",
    twitter: "https://twitter.com/xyrdron",
    docs: "https://nefira.xyz",
    discord: "https://discord.gg/mikamisono",
    sponsor: "https://github.com/sponsors/xyrdron",
  },
};
