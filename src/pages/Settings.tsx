import { Fragment, useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon, Zap, Moon, Sun, Sparkles, Palette, Mountain, Eye, Cat } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { themes } from '../themes';
import { useThemeClasses } from '../hooks/useThemeClasses';

export function Settings() {
  const { setTheme, themeName } = useTheme();
  const theme = useThemeClasses();
  
  const [fontSize, setFontSize] = useState(16);
  const [guiSize, setGuiSize] = useState(14);
  const [confirmClear, setConfirmClear] = useState(true);
  const [cursorSpeed, setCursorSpeed] = useState(0.05);

  useEffect(() => {
    const savedSize = localStorage.getItem('editorFontSize');
    const savedGuiSize = localStorage.getItem('guiFontSize');
    const savedConfirm = localStorage.getItem('confirmBeforeClear');
    const savedSpeed = localStorage.getItem('cursorAnimationSpeed');
    
    if (savedSize) {
      setFontSize(parseInt(savedSize));
    }
    if (savedGuiSize) {
      setGuiSize(parseInt(savedGuiSize));
    }
    if (savedConfirm !== null) {
      setConfirmClear(savedConfirm === 'true');
    }
    if (savedSpeed) {
      const speed = parseFloat(savedSpeed);
      setCursorSpeed(speed);
      
      const style = document.createElement('style');
      style.textContent = `
        .ace_cursor {
          transition: all ${speed}s linear !important;
        }
      `;
      style.id = 'cursor-animation-style';
      document.head.appendChild(style);
    }
  }, []);

  const changeFontSize = (newSize: number) => {
    setFontSize(newSize);
    localStorage.setItem('editorFontSize', newSize.toString());
    
    window.dispatchEvent(new CustomEvent('fontSizeChanged', { detail: newSize }));
  };

  const changeGuiSize = (newSize: number) => {
    setGuiSize(newSize);
    localStorage.setItem('guiFontSize', newSize.toString());
    document.documentElement.style.fontSize = `${newSize}px`;
    window.dispatchEvent(new CustomEvent('guiFontSizeChanged', { detail: newSize }));
  };

  const toggleConfirm = (checked: boolean) => {
    setConfirmClear(checked);
    localStorage.setItem('confirmBeforeClear', checked.toString());
    window.dispatchEvent(new CustomEvent('confirmBeforeClearChanged', { detail: checked }));
  };

  const changeCursorSpeed = (speed: number) => {
    setCursorSpeed(speed);
    localStorage.setItem('cursorAnimationSpeed', speed.toString());
    
    const style = document.createElement('style');
    style.textContent = `
      .ace_cursor {
        transition: all ${speed}s linear !important;
      }
    `;
    
    const old = document.getElementById('cursor-animation-style');
    if (old) {
      old.remove();
    }
    
    style.id = 'cursor-animation-style';
    document.head.appendChild(style);
  };

  const icons = {
    'dracula': Zap,
    'tomorrow-night': Moon,
    'github': Sun,
    'glassy': Sparkles,
    'monokai': Palette,
    'solarized-dark': Mountain,
    'cyberpunk': Eye,
    'nord': Mountain,
    'catppuccin': Cat,
  };

  const getThemeIcon = (themeName: string) => {
    const IconComponent = icons[themeName as keyof typeof icons] || Palette;
    return IconComponent;
  };

  const CurrentThemeIcon = getThemeIcon(themeName);

  return (
    <div className={theme.combine("p-4", theme.text.primary)}>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {/* Theme Setting */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-lg font-medium">Theme</p>
        <Menu as="div" className="relative inline-block text-left ml-4">
          <div>
            <Menu.Button className={theme.combine(
              "inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium items-center",
              theme.bg.secondary,
              theme.text.primary,
              theme.bg.hover,
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75'
            )}>
              <CurrentThemeIcon size={18} className={theme.text.accent} />
              <span className="mx-2">{themeName}</span>
              <ChevronDownIcon
                className="h-5 w-5"
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
            <Menu.Items className={theme.combine(
              "absolute right-0 mt-2 w-56 origin-top-right divide-y rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none z-50",
              theme.bg.secondary,
              theme.border.primary
            )}>
              <div className="px-1 py-1 ">
                {Object.keys(themes).map((themeKey) => {
                  const ThemeIcon = getThemeIcon(themeKey);
                  return (
                    <Menu.Item key={themeKey}>
                      {({ active }) => (
                        <button
                          onClick={() => setTheme(themeKey as keyof typeof themes)}
                          className={`${theme.combine(
                            active ? theme.bg.active : '',
                            theme.text.primary
                          )}
                            group flex w-full items-center rounded-md px-2 py-2 text-sm space-x-2`}
                        >
                          <ThemeIcon 
                            size={16} 
                            className={themeKey === themeName ? theme.text.accent : theme.text.secondary} 
                          />
                          <span>{themeKey}</span>
                        </button>
                      )}
                    </Menu.Item>
                  );
                })}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* Font Size Setting */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-lg font-medium">Editor Font Size</p>
          <p className={theme.combine("text-sm", theme.text.secondary)}>
            Adjust code editor font size
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Menu as="div" className="relative">
            <Menu.Button className={theme.combine(
              "px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 min-w-[80px] justify-between",
              theme.bg.secondary,
              theme.text.primary,
              theme.border.primary
            )}>
              <span>{fontSize}px</span>
              <ChevronDownIcon className="w-4 h-4" />
            </Menu.Button>
            <Menu.Items className={theme.combine(
              "absolute right-0 mt-2 w-20 rounded-lg shadow-lg z-[60] py-1",
              theme.bg.primary,
              theme.border.primary
            )}>
              {[12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map((size) => (
                <Menu.Item key={size}>
                  {({ active }) => (
                    <button
                      onClick={() => changeFontSize(size)}
                      className={theme.combine(
                        "w-full px-3 py-2 text-left text-sm",
                        active ? theme.bg.secondary : "",
                        theme.text.primary
                      )}
                    >
                      {size}px
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Menu>
          <div className="flex flex-col">
            <button
              onClick={() => changeFontSize(Math.min(24, fontSize + 1))}
              className={theme.combine(
                "p-1 rounded hover:opacity-80 transition-opacity",
                theme.text.secondary
              )}
            >
              <ChevronUpIcon className="w-3 h-3" />
            </button>
            <button
              onClick={() => changeFontSize(Math.max(12, fontSize - 1))}
              className={theme.combine(
                "p-1 rounded hover:opacity-80 transition-opacity",
                theme.text.secondary
              )}
            >
              <ChevronDownIcon className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* GUI Font Size Setting */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-lg font-medium">Interface Font Size</p>
          <p className={theme.combine("text-sm", theme.text.secondary)}>
            Adjust UI and menu font size
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Menu as="div" className="relative">
            <Menu.Button className={theme.combine(
              "px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 min-w-[80px] justify-between",
              theme.bg.secondary,
              theme.text.primary,
              theme.border.primary
            )}>
              <span>{guiSize}px</span>
              <ChevronDownIcon className="w-4 h-4" />
            </Menu.Button>
            <Menu.Items className={theme.combine(
              "absolute right-0 mt-2 w-20 rounded-lg shadow-lg z-[70] py-1",
              theme.bg.primary,
              theme.border.primary
            )}>
              {[12, 13, 14, 15, 16, 17, 18, 19, 20].map((size) => (
                <Menu.Item key={size}>
                  {({ active }) => (
                    <button
                      onClick={() => changeGuiSize(size)}
                      className={theme.combine(
                        "w-full px-3 py-2 text-left text-sm",
                        active ? theme.bg.secondary : "",
                        theme.text.primary
                      )}
                    >
                      {size}px
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Menu>
          <div className="flex flex-col">
            <button
              onClick={() => changeGuiSize(Math.min(20, guiSize + 1))}
              className={theme.combine(
                "p-1 rounded hover:opacity-80 transition-opacity",
                theme.text.secondary
              )}
            >
              <ChevronUpIcon className="w-3 h-3" />
            </button>
            <button
              onClick={() => changeGuiSize(Math.max(12, guiSize - 1))}
              className={theme.combine(
                "p-1 rounded hover:opacity-80 transition-opacity",
                theme.text.secondary
              )}
            >
              <ChevronDownIcon className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Cursor Animation Speed Setting */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-lg font-medium">Cursor Animation Speed</p>
          <p className={theme.combine("text-sm", theme.text.secondary)}>
            Adjust cursor movement animation speed in editor
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Menu as="div" className="relative">
            <Menu.Button className={theme.combine(
              "px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 min-w-[90px] justify-between",
              theme.bg.secondary,
              theme.text.primary,
              theme.border.primary
            )}>
              <span>{cursorSpeed}s</span>
              <ChevronDownIcon className="w-4 h-4" />
            </Menu.Button>
            <Menu.Items className={theme.combine(
              "absolute right-0 mt-2 w-24 rounded-lg shadow-lg z-[80] py-1",
              theme.bg.primary,
              theme.border.primary
            )}>
              {[0, 0.01, 0.02, 0.03, 0.05, 0.08, 0.1, 0.15, 0.2, 0.3].map((speed) => (
                <Menu.Item key={speed}>
                  {({ active }) => (
                    <button
                      onClick={() => changeCursorSpeed(speed)}
                      className={theme.combine(
                        "w-full px-3 py-2 text-left text-sm",
                        active ? theme.bg.secondary : "",
                        theme.text.primary
                      )}
                    >
                      {speed === 0 ? "Off" : `${speed}s`}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Menu>
        </div>
      </div>

      {/* Confirm Before Clear Setting */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-lg font-medium">Confirm Before Clear</p>
          <p className={theme.combine("text-sm", theme.text.secondary)}>
            Show confirmation dialog when clearing editor content
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={confirmClear}
            onChange={(e) => toggleConfirm(e.target.checked)}
            className="sr-only peer"
          />
          <div className={theme.combine(
            "w-11 h-6 rounded-full peer transition-colors",
            theme.bg.tertiary,
            "peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300",
            "after:content-[''] after:absolute after:top-[2px] after:left-[2px]",
            "after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all",
            "peer-checked:after:translate-x-full peer-checked:after:border-white"
          )}></div>
        </label>
      </div>
    </div>
  );
}
