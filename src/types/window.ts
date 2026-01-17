export type FocusChangeCallback = (focused: boolean) => void;

export type WindowControlButton = 'close' | 'minimize' | 'maximize';

export interface ConnectionStatusPayload {
    connected: boolean;
}

export interface WindowState {
    focused: boolean;
    maximized?: boolean;
    minimized?: boolean;
    fullscreen?: boolean;
}
