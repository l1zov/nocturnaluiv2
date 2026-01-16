import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { Titlebar } from './components/Titlebar';
import { ThemeProvider } from './context/ThemeContext';
import { useThemeClasses } from './hooks/useThemeClasses';
import { Settings } from './pages/Settings';
import { Editor } from './pages/Editor';


function App() {
  return (
    <ThemeProvider>
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

  return (
    <div
      className={themeClasses.combine(
        "relative flex flex-col h-screen font-sans rounded-[10px] overflow-hidden",
        themeClasses.bg.primary,
        themeClasses.text.primary,
        "border border-black/30"
      )}
      style={{
        boxShadow: `inset 0 0 0 1px rgba(255, 255, 255, 0.2)`
      }}
    >
      <div className="flex flex-col h-full">
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
