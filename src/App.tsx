import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { MainContent } from "./components/mainContent";
import { Sidebar } from "./components/sidebar";
import { Titlebar } from "./components/titlebar";
import VideoBackground from "./components/videoBackground";
import { ThemeProvider, useTheme } from "./context/themeContext";
import { useThemeClasses } from "./hooks/useThemeClasses";
import { Editor } from "./pages/editor";
import { Settings } from "./pages/settings";

function App() {
    return (
        <ThemeProvider defaultTheme="dracula">
            <Router>
                <Routes>
                    <Route path="/*" element={<MainLayout />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

function MainLayout() {
    const themeClasses = useThemeClasses();
    const { currentTheme } = useTheme();

    return (
        <div
            className={themeClasses.combine(
                `theme-${currentTheme.name}`,
                "relative flex flex-col h-screen font-sans rounded-[10px] overflow-hidden",
                themeClasses.bg.primary,
                themeClasses.text.primary,
            )}
        >
            {currentTheme.video && (
                <VideoBackground video={currentTheme.video} />
            )}
            <div className="relative z-10 flex flex-col h-full">
                <Titlebar />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <Routes>
                        <Route path="/" element={<MainContent />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/editor" element={<Editor />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default App;
