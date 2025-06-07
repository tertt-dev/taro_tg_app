declare global {
  interface Window {
    Telegram?: {
      WebApp?: WebApp;
    };
  }
}

interface WebApp {
  initData: string;
  initDataUnsafe?: {
    query_id?: string;
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      photo_url?: string;
    };
    auth_date?: string;
    hash?: string;
  };
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
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    isVisible: boolean;
  };
  viewportHeight?: number;
  viewportStableHeight?: number;
  onEvent?: (eventType: string, eventHandler: () => void) => void;
  offEvent?: (eventType: string, eventHandler: () => void) => void;
  openTelegramLink?: (url: string) => void;
}

export type { WebApp }; 