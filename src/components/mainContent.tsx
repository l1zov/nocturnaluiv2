import { useState } from "react";
import { APP_VERSION } from "../appVersion";
import { UPDATE_LOG } from "../constants/changelog";
import { useThemeClasses } from "../hooks/useThemeClasses";

export function MainContent() {
    const THEME = useThemeClasses();
    const [VERSION] = useState<string>(APP_VERSION);

    return (
        <main className="flex-1 flex flex-col items-center p-10 pt-20">
            <div className="text-center">
                <h1
                    className={THEME.combine(
                        "text-4xl font-bold",
                        THEME.text.primary,
                    )}
                >
                    Welcome to Nocturnal UI
                </h1>
                <p className={THEME.combine("mt-2", THEME.text.muted)}>
                    Version {VERSION || "..."}
                </p>
            </div>
            <div className="mt-10 w-full max-w-2xl">
                <h2
                    className={THEME.combine(
                        "text-lg font-semibold",
                        THEME.text.primary,
                    )}
                >
                    Recent Updates
                </h2>
                <ul className="mt-4 space-y-2">
                    {UPDATE_LOG.map((update) => (
                        <li
                            key={`${update.version}-${update.description}`}
                            className={THEME.combine(
                                "text-sm",
                                THEME.text.muted,
                            )}
                        >
                            <span
                                className={THEME.combine(
                                    "font-semibold",
                                    THEME.text.primary,
                                )}
                            >
                                {update.version}:
                            </span>{" "}
                            {update.description}
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}
