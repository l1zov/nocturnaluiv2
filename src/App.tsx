import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Titlebar } from './components/Titlebar';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { ThemeProvider } from './context/ThemeContext';
import { useThemeClasses } from './hooks/useThemeClasses';
import { Settings } from './pages/Settings';

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Router>
        <Layout />
      </Router>
    </ThemeProvider>
  );
}

function Layout() {
  const theme = useThemeClasses();

  return (
    <div className={theme.combine(
      "relative flex flex-col h-screen font-sans rounded-[10px] overflow-hidden",
      theme.bg.primary,
      theme.text.primary
    )}>
      <div className="relative z-10 flex flex-col h-full">
        <Titlebar />
        <div className="flex flex-1">
          <Sidebar />
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
