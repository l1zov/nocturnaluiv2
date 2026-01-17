import { useState } from 'react';
import { useThemeClasses } from '../hooks/useThemeClasses';
import { APP_VERSION } from '../appVersion';
import type { UpdateItem } from '../types';

export function MainContent() {
  const theme = useThemeClasses();
  const [appVersion] = useState<string>(APP_VERSION);

  const updates: UpdateItem[] = [
    { version: '25.4.1', description: 'Join our discord server.' },
    { version: 'dev 2', description: "Added Tabs Renaming. Fixes." },
    { version: 'dev 1', description: 'v2 first dev version' },
  ];

  return (
    <main className="flex-1 flex flex-col items-center p-10 pt-20">
      <div className="text-center">
        <h1 className={theme.combine("text-4xl font-bold", theme.text.primary)}>Welcome to Nocturnal UI</h1>
        <p className={theme.combine("mt-2", theme.text.muted)}>Version {appVersion || '...'}</p>
      </div>
      <div className="mt-10 w-full max-w-2xl">
        <h2 className={theme.combine("text-lg font-semibold", theme.text.primary)}>Recent Updates</h2>
        <ul className="mt-4 space-y-2">
          {updates.map((update, index) => (
            <li key={index} className={theme.combine("text-sm", theme.text.muted)}>
              <span className={theme.combine("font-semibold", theme.text.primary)}>{update.version}:</span> {update.description}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
