import { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useThemeClasses } from '../hooks/useThemeClasses';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const { themeName } = useTheme();
  const themeClasses = useThemeClasses();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

    const [snowflakes] = useState(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5,
    }))
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
        if (username.trim() && password.trim()) {
      setIsLoading(true);
      setLoadingProgress(0);
      
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onLogin();
            }, 500);
            return 100;
          }
          return prev + 10;
        });
      }, 1000);     }
  };

  return (
    <div className={themeClasses.combine(
      "min-h-screen flex items-center justify-center p-4 relative overflow-hidden",
      themeClasses.bg.primary
    )}>
      {/* Snow Background */}
      <div className="absolute inset-0 pointer-events-none">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute rounded-full bg-white opacity-80 animate-snow"
            style={{
              left: `${flake.left}%`,
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              animationDuration: `${flake.duration}s`,
              animationDelay: `${flake.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Guy */}
      <div className="absolute bottom-0 left-0 w-full h-20 pointer-events-none">
        <img 
          src="/running.gif" 
          alt="Running Animation" 
          className="absolute bottom-0 h-16 w-auto animate-walk"
        />
      </div>

      <div className={themeClasses.combine(
        "w-full max-w-md p-8 rounded-2xl shadow-2xl border relative z-10",
        themeClasses.bg.secondary,
        themeClasses.border.primary
      )}>
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className={`inline-block p-4 rounded-full mb-4 ${themeClasses.bg.tertiary}`}>
            <img 
              src="/wearemask.gif" 
              alt="Nocturnal UI Logo" 
              className="w-16 h-16"
            />
          </div>
          <h1 className={themeClasses.combine("text-3xl font-bold mb-2", themeClasses.text.primary)}>
            Nocturnal UI
          </h1>
          <p className={themeClasses.combine("text-sm", themeClasses.text.secondary)}>
            Advanced Executor Interface
          </p>
        </div>

        {!isLoading ? (
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className={themeClasses.combine("block text-sm font-medium mb-2", themeClasses.text.primary)}>
                Username
              </label>
              <div className="relative">
                <User className={themeClasses.combine("absolute left-3 top-3 w-5 h-5", themeClasses.text.secondary)} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={themeClasses.combine(
                    "w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50",
                    themeClasses.bg.tertiary,
                    themeClasses.text.primary,
                    themeClasses.border.secondary,
                    `focus:ring-${themeName === 'github' ? 'blue' : themeName === 'dracula' ? 'purple' : themeName === 'cyberpunk' ? 'cyan' : themeName === 'nord' ? 'blue' : themeName === 'catppuccin' ? 'pink' : 'cyan'}-500`
                  )}
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className={themeClasses.combine("block text-sm font-medium mb-2", themeClasses.text.primary)}>
                Password
              </label>
              <div className="relative">
                <Lock className={themeClasses.combine("absolute left-3 top-3 w-5 h-5", themeClasses.text.secondary)} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={themeClasses.combine(
                    "w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50",
                    themeClasses.bg.tertiary,
                    themeClasses.text.primary,
                    themeClasses.border.secondary,
                    `focus:ring-${themeName === 'github' ? 'blue' : themeName === 'dracula' ? 'purple' : themeName === 'cyberpunk' ? 'cyan' : themeName === 'nord' ? 'blue' : themeName === 'catppuccin' ? 'pink' : 'cyan'}-500`
                  )}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={themeClasses.combine(
                    "absolute right-3 top-3 w-5 h-5 hover:opacity-80",
                    themeClasses.text.secondary
                  )}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={!username.trim() || !password.trim()}
              className={themeClasses.combine(
                "w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                themeName === 'github' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                themeName === 'dracula' ? 'bg-purple-500 hover:bg-purple-400 text-white' :
                themeName === 'cyberpunk' ? 'bg-cyan-600 hover:bg-cyan-700 text-black' :
                themeName === 'nord' ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                themeName === 'catppuccin' ? 'bg-pink-500 hover:bg-pink-600 text-white' :
                'bg-cyan-600 hover:bg-cyan-700 text-white'
              )}
            >
              Sign In
            </button>

            {/* Additional Info */}
            <div className="text-center">
              <p className={themeClasses.combine("text-xs", themeClasses.text.secondary)}>
                Enter any credentials to log in (dummy login)
              </p>
            </div>
          </form>
        ) : (
          /* Loading Screen */
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <p className={themeClasses.combine("text-lg font-medium", themeClasses.text.primary)}>
                Authenticating...
              </p>
              
              {/* Progress Bar */}
              <div className={themeClasses.combine("w-full bg-gray-700 rounded-full h-2", themeClasses.bg.tertiary)}>
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    themeName === 'github' ? 'bg-blue-600' :
                    themeName === 'dracula' ? 'bg-purple-500' :
                    themeName === 'cyberpunk' ? 'bg-cyan-500' :
                    themeName === 'nord' ? 'bg-blue-500' :
                    themeName === 'catppuccin' ? 'bg-pink-500' :
                    'bg-cyan-600'
                  }`}
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              
              <p className={themeClasses.combine("text-sm", themeClasses.text.secondary)}>
                {loadingProgress < 30 ? 'Verifying credentials...' :
                 loadingProgress < 60 ? 'Establishing connection...' :
                 loadingProgress < 90 ? 'Loading interface...' :
                 'Almost ready...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
