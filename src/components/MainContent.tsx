import { useThemeClasses } from '../hooks/useThemeClasses';
import { ExternalLink, MessageCircle } from 'lucide-react';

export function MainContent() {
  const theme = useThemeClasses();
  
  const updates = [
    { 
      version: '2.5.0 MAJOR UPDATE', 
      date: 'February 2025',
      desc: 'Complete UI overhaul with advanced theme system, animated login screen with snow effects, walking character animation, and comprehensive settings panel.',
      features: [
        'New animated login system with progress bar',
        'Snow animation background effects',
        'Walking character animation',
        '9 premium themes (GitHub Dark, Dracula, Cyberpunk, Nord, etc.)',
        'Advanced font controls with dropdown + increment buttons',
        'Theme-consistent color system across all components',
        'Improved code editor with theme integration',
        'Local storage for persistent settings',
        'Smooth animations and transitions'
      ]
    },
    { 
      version: '2.0.0 LTS', 
      date: 'November 2024',
      desc: 'Long-term support version with critical bug fixes.',
      features: [
        'Stability improvements',
      ]
    }
  ];

  const openDiscord = () => {
    window.open('https://discord.gg/JJ8HEFcT6V', '_blank');
  };

  const openProducts = () => {
    window.open('https://born.nocturnal.wtf', '_blank');
  };

  return (
    <main className="flex-1 flex flex-col p-6 pt-20 overflow-y-auto">
      <div className="text-center mb-8">
        <h1 className={theme.combine("text-5xl font-bold mb-4", theme.text.primary)}>
          Welcome to Nocturnal UI v1.5
        </h1>
        <p className={theme.combine("text-xl mb-6", theme.text.muted)}>
          The Ultimate Roblox Executor Interface
        </p>
        <div className={theme.combine("inline-block px-4 py-2 rounded-full text-sm font-semibold", theme.bg.tertiary, theme.text.primary)}>
          Version 1.5.0 - Latest Release
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={openDiscord}
          className={theme.combine(
            "flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg",
            "bg-[#5865F2] hover:bg-[#4752C4] text-white"
          )}
        >
          <MessageCircle size={20} />
          Join Discord
        </button>
        <button
          onClick={openProducts}
          className={theme.combine(
            "flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg",
            "bg-purple-600 hover:bg-purple-700 text-white"
          )}
        >
          <ExternalLink size={20} />
          Other Products
        </button>
      </div>

      {/* Update Log */}
      <div className="w-full max-w-4xl mx-auto">
        <h2 className={theme.combine("text-3xl font-bold mb-6 text-center", theme.text.primary)}>
          🚀 Update Log
        </h2>
        
        <div className="space-y-6">
          {updates.map((update, index) => (
            <div
              key={index}
              className={theme.combine(
                "p-6 rounded-xl border-2 shadow-lg transition-all duration-200 hover:scale-[1.02]",
                theme.bg.secondary,
                theme.border.primary,
                index === 0 ? "ring-2 ring-blue-500 ring-opacity-50" : ""
              )}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={theme.combine("text-xl font-bold", theme.text.primary)}>
                    {update.version}
                    {index === 0 && (
                      <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-500 text-white">
                        LATEST
                      </span>
                    )}
                  </h3>
                  <p className={theme.combine("text-sm", theme.text.muted)}>{update.date}</p>
                </div>
              </div>
              
              <p className={theme.combine("text-base mb-4", theme.text.secondary)}>
                {update.desc}
              </p>
              
              <div className="space-y-2">
                <h4 className={theme.combine("font-semibold text-sm", theme.text.primary)}>
                  Key Features:
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {update.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className={theme.combine("text-sm flex items-center gap-2", theme.text.muted)}
                    >
                      <span className="text-green-500">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
