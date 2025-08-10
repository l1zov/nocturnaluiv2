import { invoke } from "@tauri-apps/api/core";
import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { themes } from "../themes";
import type { Theme } from "../types/theme";

type AvailableThemes = keyof typeof themes;

interface ThemeContextType {
    currentTheme: Theme;
    themeName: AvailableThemes;
    setTheme: (themeName: AvailableThemes) => void;
    loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}

interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: AvailableThemes;
}

export function ThemeProvider({
    children,
    defaultTheme = "dracula",
}: ThemeProviderProps) {
    const [themeName, setThemeName] = useState<AvailableThemes>(defaultTheme);
    const [loading, setLoading] = useState(true);
    const currentTheme = themes[themeName];

    useEffect(() => {
        invoke<string>("load_settings", { key: "theme" })
            .then((savedTheme) => {
                if (savedTheme && themes[savedTheme as AvailableThemes]) {
                    setThemeName(savedTheme as AvailableThemes);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const setTheme = (newThemeName: AvailableThemes) => {
        setThemeName(newThemeName);
        invoke("save_settings", { key: "theme", value: newThemeName }).catch(
            console.error,
        );
    };

    return (
        <ThemeContext.Provider
            value={{ currentTheme, themeName, setTheme, loading }}
        >
            {!loading && children}
        </ThemeContext.Provider>
    );
}
