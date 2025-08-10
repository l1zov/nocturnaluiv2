import { Menu, Transition, Tab } from "@headlessui/react";
import { motion } from "motion/react";
import { ChevronDownIcon } from "lucide-react";
import { Fragment, useCallback, useLayoutEffect, useRef, useState } from "react";
import { useTheme } from "../context/themeContext";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { themes } from "../themes";

const SETTINGS_TABS = [
    { key: "general", label: "General" },
    { key: "appearance", label: "Appearance" },
    { key: "editor", label: "Editor" },
    { key: "advanced", label: "Advanced" },
] as const;

export function Settings() {
    const { setTheme, themeName } = useTheme();
    const themeClasses = useThemeClasses();
    const [tabIndex, setTabIndex] = useState(0);
    const listRef = useRef<HTMLDivElement | null>(null);
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [indicator, setIndicator] = useState<{ left: number; width: number }>({ left: 2, width: 0 });

    const updateIndicator = useCallback((index: number) => {
        const btn = tabRefs.current[index];
        const list = listRef.current;
        if (!btn || !list) return;
        const left = btn.offsetLeft - list.scrollLeft;
        const width = Math.max(0, btn.offsetWidth);
        setIndicator({ left, width });
    }, []);

    useLayoutEffect(() => {
        updateIndicator(tabIndex);
        const onResize = () => updateIndicator(tabIndex);
        const onScroll = () => updateIndicator(tabIndex);
        window.addEventListener("resize", onResize);
        const list = listRef.current;
        list?.addEventListener("scroll", onScroll);
        return () => {
            window.removeEventListener("resize", onResize);
            list?.removeEventListener("scroll", onScroll);
        };
    }, [tabIndex, updateIndicator]);

    const formatThemeLabel = (key: string) => {
        if (key === "github") return "Github Light";
        if (key === "ayu") return "Ayu Light";
        return key.charAt(0).toUpperCase() + key.slice(1);
    };

    return (
        <div className={themeClasses.combine("container mx-auto px-4 py-4 w-full flex flex-col min-w-0", themeClasses.text.primary)}>
            <h1 className="text-2xl font-bold mb-4 text-center">Settings</h1>

            <Tab.Group selectedIndex={tabIndex} onChange={setTabIndex}>
                <Tab.List
                    ref={listRef}
                    className={themeClasses.combine(
                        "relative flex gap-0 p-0 rounded-lg border items-stretch h-10 w-fit mx-auto",
                        themeClasses.bg.secondary,
                        themeClasses.border.primary,
                    )}
                >
                    <motion.span
                        aria-hidden
                        className={themeClasses.combine(
                            "absolute top-0 bottom-0 pointer-events-none",
                            themeClasses.bg.active,
                        )}
                        animate={{ left: indicator.left, width: indicator.width }}
                        transition={{ type: "spring", stiffness: 600, damping: 38, mass: 0.3 }}
                        style={{ left: indicator.left, width: indicator.width }}
                    />
                    
                    {SETTINGS_TABS.map((t, idx) => (
                        <Tab as={Fragment} key={t.key}>
                            {({ selected }) => (
                                <button
                                    type="button"
                                    className={themeClasses.combine(
                                        "relative px-3 text-sm font-medium transition-all border-l first:border-l-0 h-full flex items-center overflow-hidden",
                                        selected
                                            ? themeClasses.text.primary
                                            : themeClasses.text.secondary,
                                        themeClasses.border.primary,
                                        "hover:opacity-90 focus:outline-none",
                                    )}
                                    ref={(el) => {
                                        tabRefs.current[idx] = el;
                                        // Initialize indicator on first render
                                        if (idx === tabIndex && el) updateIndicator(tabIndex);
                                    }}
                                >
                                    <span className="relative z-10">{t.label}</span>
                                </button>
                            )}
                        </Tab>
                    ))}
                </Tab.List>

                <Tab.Panels className="mt-8 w-full max-w-3xl mx-auto px-6">
                    <Tab.Panel>
                        <div className="space-y-4">
                            <p className="text-sm opacity-80">Nothing here to see.</p>
                        </div>
                    </Tab.Panel>

                    <Tab.Panel>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-base font-medium">Theme</p>
                                <Menu as="div" className="relative inline-block text-left">
                                    <div>
                                        <Menu.Button
                                            className={themeClasses.combine(
                                                "inline-flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium border min-w-[140px]",
                                                themeClasses.bg.secondary,
                                                themeClasses.text.primary,
                                                themeClasses.bg.hover,
                                                themeClasses.border.primary,
                                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75",
                                            )}
                                        >
                                            {formatThemeLabel(themeName)}
                                            <ChevronDownIcon
                                                className="-mr-1 ml-2 h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items
                                            className={themeClasses.combine(
                                                "absolute right-0 mt-2 w-44 origin-top-right rounded-lg shadow-lg border focus:outline-none z-10 max-h-60 overflow-y-auto",
                                                themeClasses.bg.secondary,
                                                themeClasses.border.primary,
                                            )}
                                        >
                                            <div className="px-1 py-1 ">
                                                {Object.keys(themes).map((theme) => (
                                                    <Menu.Item key={theme}>
                                                        {({ active }) => (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setTheme(
                                                                        theme as keyof typeof themes,
                                                                    )
                                                                }
                                                                className={`${themeClasses.combine(
                                                                    active
                                                                        ? themeClasses.bg.active
                                                                        : "",
                                                                    themeClasses.text.primary,
                                                                )}
                                                group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                            >
                                                                {formatThemeLabel(theme)}
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                ))}
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </Tab.Panel>

                    <Tab.Panel>
                        <div className="space-y-4">
                            <p className="text-sm opacity-80">Nothing here to see.</p>
                        </div>
                    </Tab.Panel>

                    <Tab.Panel>
                        <div className="space-y-4">
                            <p className="text-sm opacity-80">Nothing here to see.</p>
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
}
