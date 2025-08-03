import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { themes } from '../themes';
import { useThemeClasses } from '../hooks/useThemeClasses';

export function Settings() {
  const { setTheme, themeName } = useTheme();
  const themeClasses = useThemeClasses();

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
              {themeName}
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
            <Menu.Items className={themeClasses.combine(
              "absolute right-0 mt-2 w-40 origin-top-right rounded-lg shadow-lg border focus:outline-none z-10",
              themeClasses.bg.secondary,
              themeClasses.border.primary
            )}>
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
                        {theme}
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
