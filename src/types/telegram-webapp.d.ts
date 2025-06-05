interface TelegramWebApp {
  WebApp: {
    ready: () => void;
    expand: () => void;
    close: () => void;
    MainButton: {
      text: string;
      show: () => void;
      hide: () => void;
      onClick: (callback: () => void) => void;
    };
    initDataUnsafe: {
      user?: {
        id: number;
        first_name: string;
        last_name?: string;
        username?: string;
        language_code?: string;
      };
      query_id?: string;
    };
  };
}

declare global {
  interface Window {
    Telegram: TelegramWebApp;
  }
}

export {}; 