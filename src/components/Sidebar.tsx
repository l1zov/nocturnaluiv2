import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { BOTTOM_NAV_LINKS, MAIN_NAV_LINKS } from "../constants/navigation";
import { useThemeClasses } from "../hooks/useThemeClasses";

export function Sidebar() {
    const THEME = useThemeClasses();
    const LOCATION = useLocation();

    const getLinkClass = (path: string) => {
        const isActive = LOCATION.pathname === path;
        return THEME.combine(
            "flex items-center py-3 px-4 text-base font-medium transition-all duration-200 relative",
            isActive ? THEME.text.primary : THEME.text.secondary,
            `hover:${THEME.text.primary.replace("text-", "")}`,
            isActive ? "" : THEME.bg.hover,
        );
    };

    const ActiveBorder = ({
        isActive,
        section,
    }: {
        isActive: boolean;
        section: "main" | "bottom";
    }) => {
        const BORDER_COLOR = THEME.border.accent.replace("border", "bg");
        return isActive ? (
            <motion.div
                layoutId={`active-border-${section}`}
                className={THEME.combine(
                    "absolute left-0 top-0 bottom-0 w-1",
                    BORDER_COLOR,
                )}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                }}
            />
        ) : null;
    };

    const renderLinks = (
        links: typeof MAIN_NAV_LINKS,
        section: "main" | "bottom",
    ) => (
        <nav className="flex flex-col w-full">
            {links.map((link) => {
                const IS_ACTIVE = LOCATION.pathname === link.href;
                return (
                    <Link
                        key={link.href}
                        to={link.href}
                        className={getLinkClass(link.href)}
                    >
                        <ActiveBorder isActive={IS_ACTIVE} section={section} />
                        <span>{link.label}</span>
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <aside
            className={THEME.combine(
                "w-48 flex flex-col border-r h-full",
                THEME.border.primary,
            )}
        >
            {renderLinks(MAIN_NAV_LINKS, "main")}
            <div className="mt-auto">
                {renderLinks(BOTTOM_NAV_LINKS, "bottom")}
            </div>
        </aside>
    );
}
