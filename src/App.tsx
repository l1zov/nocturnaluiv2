import "./App.css";
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Titlebar } from './components/Titlebar';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { useTheme, ThemeProvider } from './context/ThemeContext';
import { useThemeClasses } from './hooks/useThemeClasses';
import VideoBackground from './components/VideoBackground';
import { Settings } from './pages/Settings';
import { Editor } from './pages/Editor';
import { Login } from './pages/Login';

function App() {
  return (
    <ThemeProvider defaultTheme="dracula">
      <Router>
        <Layout />
      </Router>
    </ThemeProvider>
  );
}

function Layout() {
  const themeClasses = useThemeClasses();
  const { currentTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check if user was previously logged in
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className={themeClasses.combine(
      `theme-${currentTheme.name}`,
      "relative flex flex-col h-screen font-sans rounded-[10px] overflow-hidden",
      themeClasses.bg.primary,
      themeClasses.text.primary
    )}>
      {currentTheme.video && <VideoBackground video={currentTheme.video} />}
      <div className="relative z-10 flex flex-col h-full">
        <Titlebar onLogout={handleLogout} />
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
