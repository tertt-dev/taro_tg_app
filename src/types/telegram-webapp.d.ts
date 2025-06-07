declare global {
  interface Window {
    Telegram?: {
      WebApp?: WebApp;
    };
  }
}

interface MainButton {
  text: string;
  color: string;
  textColor: string;
  isVisible: boolean;
  isActive: boolean;
  isProgressVisible: boolean;
  show: () => void;
  hide: () => void;
  enable: () => void;
  disable: () => void;
  showProgress: () => void;
  hideProgress: () => void;
  setText: (text: string) => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
}

type TelegramEventHandler = (...args: unknown[]) => void;

interface WebApp {
  initData: string;
  initDataUnsafe: {
    query_id: string;
    user: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      photo_url?: string;
    };
    auth_date: number;
    hash: string;
  };
  platform: string;
  version: string;
  viewportHeight: number;
  viewportStableHeight: number;
  isExpanded: boolean;
  onEvent(eventType: string, eventHandler: TelegramEventHandler): void;
  offEvent(eventType: string, eventHandler: TelegramEventHandler): void;
  ready(): void;
  expand(): void;
  close(): void;
  MainButton: MainButton;
  BackButton?: {
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    isVisible: boolean;
  };
  openTelegramLink?: (url: string) => void;
}

export type { WebApp }; 