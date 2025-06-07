export interface TelegramWebApp {
  initData: string;
  ready?: () => void;
  expand?: () => void;
  close?: () => void;
  MainButton?: {
    text: string;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
  };
  BackButton?: {
    show(): void;
    hide(): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  };
  initDataUnsafe?: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      photo_url?: string;
    };
    theme_params?: {
      bg_color: string;
      text_color: string;
      hint_color: string;
      link_color: string;
      button_color: string;
      button_text_color: string;
    };
  };
  platform?: string;
  colorScheme?: 'light' | 'dark';
  themeParams?: Record<string, string>;
  isExpanded?: boolean;
  viewportHeight?: number;
  viewportStableHeight?: number;
  headerColor?: string;
  backgroundColor?: string;
  setHeaderColor?(color: string): void;
  setBackgroundColor?(color: string): void;
  onEvent?(eventType: string, eventHandler: () => void): void;
  offEvent?(eventType: string, eventHandler: () => void): void;
  sendData?(data: unknown): void;
  enableClosingConfirmation?(): void;
  disableClosingConfirmation?(): void;
  openTelegramLink?(url: string): void;
  [key: string]: unknown;
}

interface TelegramType {
  WebApp: TelegramWebApp;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export type { TelegramWebApp, TelegramType }; 