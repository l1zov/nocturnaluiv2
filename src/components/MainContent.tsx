import { useThemeClasses } from '../hooks/useThemeClasses';

export function MainContent() {
  const theme = useThemeClasses();
  
  const updates = [
    { version: '1.2.1 LTS', description: 'Fixed known bugs. First LTS version!' },
  ];

  return (
    <main className="flex-1 flex flex-col items-center p-10 pt-20">
      <div className="text-center">
        <h1 className={theme.combine("text-4xl font-bold", theme.text.primary)}>Welcome to Nocturnal UI v2</h1>
        <p className={theme.combine("mt-2", theme.text.muted)}>Version 2.0.0 (pre-release)</p>
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
