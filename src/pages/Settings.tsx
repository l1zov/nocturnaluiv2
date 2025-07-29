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
      <div className="flex items-center justify-between">
        <p>Theme</p>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className={themeClasses.combine(
              "inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium",
              themeClasses.bg.secondary,
              themeClasses.text.primary,
              themeClasses.bg.hover,
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
              "absolute right-0 mt-2 w-56 origin-top-right divide-y rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none",
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
