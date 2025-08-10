import { Link, useLocation } from "react-router-dom";
import { useThemeClasses } from "../hooks/useThemeClasses";

export function Sidebar() {
    const theme = useThemeClasses();
    const location = useLocation();

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/editor", label: "Editor" },
    ];

    const bottomLinks = [{ href: "/settings", label: "Settings" }];

    const getLinkClass = (path: string) => {
        const isActive = location.pathname === path;
        return theme.combine(
            "flex items-center py-3 px-4 text-base font-medium transition-all duration-200",
            isActive ? theme.text.primary : theme.text.secondary,
            isActive ? theme.border.accent : "border-transparent",
            isActive ? theme.bg.active : "",
            `hover:${theme.text.primary.replace("text-", "")}`,
            isActive ? "" : theme.bg.hover,
            "border-l-4",
        );
    };

    return (
        <aside
            className={theme.combine(
                "w-56 flex flex-col border-r",
                theme.border.primary,
            )}
        >
            <nav className="flex flex-col">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        to={link.href}
                        className={getLinkClass(link.href)}
                    >
                        <span>{link.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="mt-auto">
                <nav className="flex flex-col">
                    {bottomLinks.map((link) => (
                        <Link
                            key={link.href}
                            to={link.href}
                            className={getLinkClass(link.href)}
                        >
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>
    );
}
