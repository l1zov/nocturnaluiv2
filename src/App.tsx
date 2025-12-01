import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { Titlebar } from './components/Titlebar';
import { useTheme, ThemeProvider } from './context/ThemeContext';
import { useThemeClasses } from './hooks/useThemeClasses';
import VideoBackground from './components/VideoBackground';
import { Settings } from './pages/Settings';
import { Editor } from './pages/Editor';


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
    <div className={themeClasses.combine(
      `theme-${currentTheme.name}`,
      "relative flex flex-col h-screen font-sans rounded-[10px] overflow-hidden",
      themeClasses.bg.primary,
      themeClasses.text.primary,
      "border border-black/30"
    )}
    style={{
      boxShadow: `inset 0 0 0 1px rgba(255, 255, 255, 0.2)`
    }}>
      {currentTheme.video && <VideoBackground video={currentTheme.video} />}
      <div className="relative z-10 flex flex-col h-full">
        <Titlebar />
        <div className="flex flex-1 min-h-0 mr-px">
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
