import type { NavLink } from "../types/navigation";

export const MAIN_NAV_LINKS: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/editor", label: "Editor" },
] as const;

export const BOTTOM_NAV_LINKS: NavLink[] = [
    { href: "/settings", label: "Settings" },
] as const;
