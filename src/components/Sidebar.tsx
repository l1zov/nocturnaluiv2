import { Link, useLocation } from 'react-router-dom';
import { Home, Code, Settings } from 'lucide-react';
import { useThemeClasses } from '../hooks/useThemeClasses';

export function Sidebar() {
  const theme = useThemeClasses();
  const location = useLocation();

  const nav = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/editor', label: 'Editor', icon: Code },
  ];

  const bottom = [
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const getClass = (path: string) => {
    const active = location.pathname === path;
    return theme.combine(
      'flex items-center py-3 px-4 text-base font-medium transition-all duration-200',
      active ? theme.text.primary : theme.text.secondary,
      active ? theme.border.accent : 'border-transparent',
      active ? theme.bg.active : '',
      `hover:${theme.text.primary.replace('text-', '')}`,
      active ? '' : theme.bg.hover,
      'border-l-4'
    );
  };

  return (
    <aside className={theme.combine('w-56 flex flex-col border-r', theme.border.primary)}>
      <nav className="flex flex-col">
        {nav.map(link => {
          const IconComponent = link.icon;
          return (
            <Link key={link.href} to={link.href} className={getClass(link.href)}>
              <IconComponent size={18} className="mr-3" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <nav className="flex flex-col">
          {bottom.map(link => {
            const IconComponent = link.icon;
            return (
              <Link key={link.href} to={link.href} className={getClass(link.href)}>
                <IconComponent size={18} className="mr-3" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
