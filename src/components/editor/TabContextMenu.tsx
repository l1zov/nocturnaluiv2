import { Fragment, useState, useEffect } from 'react';
import { Menu, MenuItem, MenuItems, MenuButton, Transition } from '@headlessui/react';
import { useThemeRawColors } from '../../hooks/useThemeRawColors';
import type { TabContextMenuProps } from '../../types';

export function TabContextMenu({
  tab,
  x,
  y,
  tabCount,
  onClose,
  onRename,
  onDuplicate,
  onCloseTab,
  onCloseOtherTabs,
  onCloseAllTabs,
}: TabContextMenuProps) {
  const rawColors = useThemeRawColors();
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleAction = (action: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    // Delay action until animation completes
    setTimeout(() => {
      action();
      onClose();
    }, 100);
  };

  return (
    <Menu as="div" className="fixed z-50" style={{ left: x, top: y }}>
      {() => (
        <>
          <MenuButton className="hidden" />
          <Transition
            show={isVisible}
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="transform opacity-0 scale-90"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-90"
            afterLeave={onClose}
          >
            <MenuItems
              static
              className="w-48 rounded-lg shadow-xl focus:outline-none overflow-hidden origin-top-left"
              style={{
                backgroundColor: rawColors.background.secondary,
                border: `1px solid ${rawColors.border.primary}`,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
              }}
            >
              <div className="px-1 py-1">
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={handleAction(() => onRename(tab.id, tab.title))}
                      className="w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-150 ease-out group"
                      style={{
                        backgroundColor: focus ? rawColors.background.tertiary : 'transparent',
                        color: rawColors.text.primary,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = rawColors.background.tertiary;
                      }}
                      onMouseLeave={(e) => {
                        if (!focus) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      Rename
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={handleAction(() => onDuplicate(tab))}
                      className="w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-150 ease-out group"
                      style={{
                        backgroundColor: focus ? rawColors.background.tertiary : 'transparent',
                        color: rawColors.text.primary,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = rawColors.background.tertiary;
                      }}
                      onMouseLeave={(e) => {
                        if (!focus) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      Duplicate
                    </button>
                  )}
                </MenuItem>
                <div 
                  className="my-1 h-px mx-2 transition-opacity duration-200" 
                  style={{ backgroundColor: rawColors.border.primary }}
                />
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={handleAction(() => onCloseTab(tab.id))}
                      className="w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-150 ease-out group"
                      style={{
                        backgroundColor: focus ? rawColors.background.tertiary : 'transparent',
                        color: rawColors.text.primary,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = rawColors.background.tertiary;
                      }}
                      onMouseLeave={(e) => {
                        if (!focus) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      Close
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={handleAction(() => onCloseOtherTabs(tab.id))}
                      disabled={tabCount <= 1}
                      className="w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-150 ease-out group"
                      style={{
                        backgroundColor: focus && tabCount > 1 ? rawColors.background.tertiary : 'transparent',
                        color: tabCount > 1 ? rawColors.text.primary : rawColors.text.secondary,
                        opacity: tabCount > 1 ? 1 : 0.5,
                        cursor: tabCount > 1 ? 'pointer' : 'not-allowed',
                      }}
                      onMouseEnter={(e) => {
                        if (tabCount > 1) {
                          e.currentTarget.style.backgroundColor = rawColors.background.tertiary;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!focus && tabCount > 1) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      Close Others
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={handleAction(() => onCloseAllTabs())}
                      className="w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-150 ease-out group"
                      style={{
                        backgroundColor: focus ? rawColors.background.tertiary : 'transparent',
                        color: rawColors.text.primary,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = rawColors.background.tertiary;
                      }}
                      onMouseLeave={(e) => {
                        if (!focus) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      Close All
                    </button>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Transition>
        </>
      )}
    </Menu>
  );
}
