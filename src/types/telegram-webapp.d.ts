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
}

export type { WebApp }; 