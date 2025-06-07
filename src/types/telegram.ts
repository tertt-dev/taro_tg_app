export interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export interface TelegramWebAppInitData {
  query_id: string;
  user: TelegramWebAppUser;
  auth_date: number;
  hash: string;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: TelegramWebAppInitData;
  platform?: string;
  version?: string;
  viewportHeight?: number;
  viewportStableHeight?: number;
  isExpanded?: boolean;
  BackButton?: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  MainButton?: {
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
  };
  onEvent?: (eventType: string, callback: () => void) => void;
  offEvent?: (eventType: string, callback: () => void) => void;
  ready?: () => void;
  expand?: () => void;
  close?: () => void;
}

export interface TelegramUser {
  id?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
} 