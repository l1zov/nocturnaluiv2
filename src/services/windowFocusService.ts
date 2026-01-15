import { getCurrentWindow } from '@tauri-apps/api/window';

type FocusChangeCallback = (focused: boolean) => void;

let focusChangeCallback: FocusChangeCallback | null = null;

export async function initializeWindowFocusListener(callback: FocusChangeCallback): Promise<() => void> {
    focusChangeCallback = callback;

    const appWindow = getCurrentWindow();

    const unlistenFocus = await appWindow.onFocusChanged(({ payload: focused }) => {
        callback(focused);
    });

    const handleFocus = () => {
        callback(true);
    };

    const handleBlur = () => {
        callback(false);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
        unlistenFocus();
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('blur', handleBlur);
        focusChangeCallback = null;
    };
}

export function getWindowFocusCallback(): FocusChangeCallback | null {
    return focusChangeCallback;
}
