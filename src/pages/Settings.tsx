import { Fragment, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { themes } from '../themes';
import { useThemeClasses } from '../hooks/useThemeClasses';
// import { settingsService, DEFAULT_SETTINGS } from '../services';

export function Settings() {
  const { setTheme, themeName } = useTheme();
  const themeClasses = useThemeClasses();

  // const initial = settingsService.get() || DEFAULT_SETTINGS;
  // const [fontFamily, setFontFamily] = useState<string>(String(initial.fontFamily || DEFAULT_SETTINGS.fontFamily));
  // const [fontSize, setFontSize] = useState<number>(Number(initial.fontSize || DEFAULT_SETTINGS.fontSize));
  // const [autosave, setAutosave] = useState<boolean>(Boolean(initial.autosave));
  // const [autosaveIntervalSec, setAutosaveIntervalSec] = useState<number>(Number(initial.autosaveIntervalSec || DEFAULT_SETTINGS.autosaveIntervalSec));
  // const [showLineNumbers, setShowLineNumbers] = useState<boolean>(Boolean(initial.showLineNumbers));

  // useEffect(() => {
  //   const unsub = settingsService.subscribe((s) => {
  //     setFontFamily(String(s.fontFamily || DEFAULT_SETTINGS.fontFamily));
  //     setFontSize(Number(s.fontSize || DEFAULT_SETTINGS.fontSize));
  //     setAutosave(Boolean(s.autosave));
  //     setAutosaveIntervalSec(Number(s.autosaveIntervalSec || DEFAULT_SETTINGS.autosaveIntervalSec));
  //     setShowLineNumbers(Boolean(s.showLineNumbers));
  //   });
  //   return () => unsub && unsub();
  // }, []);

  useEffect(() => {
    const styleId = 'theme-dropdown-scrollbar-styles';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.innerHTML = `
      .theme-dropdown-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
      .theme-dropdown-scrollbar::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.35); border-radius: 6px; }
      .theme-dropdown-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(128,128,128,0.55); }
      .theme-dropdown-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(128,128,128,0.35) transparent; }
    `;

    return () => {
      try { styleEl && styleEl.parentNode?.removeChild(styleEl); } catch (e) {}
    };
  }, []);

  // const applySetting = (key: string, value: unknown) => {
  //   try {
  //     // prefer typed setter when possible
  //     settingsService.set({ [key]: value } as any);
  //   } catch (e) {
  //     // swallow
  //   }
  // }

  return (
    <div className={themeClasses.combine("p-4", themeClasses.text.primary)}>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="flex items-center justify-between gap-4">
        <p className="text-base font-medium">Theme</p>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className={themeClasses.combine(
              "inline-flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium border min-w-[120px]",
              themeClasses.bg.secondary,
              themeClasses.text.primary,
              themeClasses.bg.hover,
              themeClasses.border.primary,
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75'
            )}>
              {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
              <ChevronDownIcon
                className="-mr-1 ml-2 h-5 w-5"
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
            <Menu.Items className={`${themeClasses.combine(
              "absolute right-0 mt-2 w-40 origin-top-right rounded-lg shadow-lg border focus:outline-none z-10 max-h-60 overflow-y-auto",
              themeClasses.bg.secondary,
              themeClasses.border.primary
            )} theme-dropdown-scrollbar`}>
              <div className="px-1 py-1 ">
                {Object.keys(themes).map((theme) => (
                  <Menu.Item key={theme}>
                    {({ active }) => (
                      <button
                        onClick={() => setTheme(theme as keyof typeof themes)}
                        className={`${themeClasses.combine(
                          active ? themeClasses.bg.active : '',
                          themeClasses.text.primary
                        )}
                          group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}
